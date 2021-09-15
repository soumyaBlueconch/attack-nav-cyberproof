import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
// import { Http } from '@angular/http'
import { Observable, forkJoin } from "rxjs";
import { from } from 'rxjs';
import { TaxiiConnect, Server, Collections, Collection, Status } from '../taxii2lib';

@Injectable({
    providedIn: 'root',
})
export class DataService {

    constructor(private http: HttpClient) {
        console.log("initializing data service singleton")
        let subscription = this.getConfig().subscribe({
            next: (config: any) => {
                this.setUpURLs(config["versions"]);
            },
            complete: () => { if (subscription) subscription.unsubscribe(); } //prevent memory leaks
        })
    }
    async initializeDomains() {
      return new Promise((resolve,reject)=>{
        let subscription = this.getConfig().subscribe({
            next: (config: any) => {
                this.setUpURLs(config["versions"]);
                resolve(1)
            },
            complete: () => { if (subscription) subscription.unsubscribe();  reject(0)} //prevent memory leaks
        })
      })
    }
    public domain_backwards_compatibility: any = {
        "mitre-enterprise": "enterprise-attack",
        "mitre-mobile": "mobile-attack"
    }
    public domains: Domain[] = [];
    public versions: string[] = ["ATT&CK v9", "ATT&CK v8", "ATT&CK v7", "ATT&CK v6", "ATT&CK v5", "ATT&CK v4"]

    public subtechniquesEnabled: boolean = true;

    /**
     * Callback functions passed to this function will be called after data is loaded
     * @param {*} callback callback function to call when data is done loading
     */
    public onDataLoad(domainID: string | any, callback: () => void) {
        this.getDomain(domainID).dataLoadedCallbacks.push(callback);
    }

    /**
     * Parse the given stix bundle into the relevant data holders
     * @param {any[]} stixBundle: the STIX bundle to parse
     */
    parseBundle(domain: Domain | any, stixBundles: any[]): void {
        let platforms = new Set<String>();
        for (let bundle of stixBundles) {
            let techniqueSDOs = [];
            let matrixSDOs = [];
            let idToTechniqueSDO = new Map<string, any>();
            let idToTacticSDO = new Map<string, any>();
            for (let sdo of bundle.objects) { //iterate through stix domain objects in the bundle
                // ignore deprecated and revoked objects in the bundle
                if (sdo.x_mitre_deprecated || sdo.revoked) continue;
                // parse according to type
                switch (sdo.type) {
                    case "intrusion-set":
                        domain.groups.push(new Group(sdo, this));
                        break;
                    case "malware":
                    case "tool":
                        let soft = new Software(sdo, this)
                        domain.software.push(soft);
                        break;
                    case "course-of-action":
                        domain.mitigations.push(new Mitigation(sdo, this));
                        break;
                    case "relationship":
                        if (sdo.relationship_type == "subtechnique-of" && this.subtechniquesEnabled) {
                            // record subtechnique:technique relationship
                            if (domain.relationships["subtechniques_of"].has(sdo.target_ref)) {
                                let ids = domain.relationships["subtechniques_of"].get(sdo.target_ref);
                                ids.push(sdo.source_ref);
                            } else {
                                domain.relationships["subtechniques_of"].set(sdo.target_ref, [sdo.source_ref])
                            }
                        } else if (sdo.relationship_type == "uses") {
                            if (sdo.source_ref.startsWith("intrusion-set") && sdo.target_ref.startsWith("attack-pattern")) {
                                // record group:technique relationship
                                if (domain.relationships["group_uses"].has(sdo.source_ref)) {
                                    let ids = domain.relationships["group_uses"].get(sdo.source_ref);
                                    ids.push(sdo.target_ref);
                                } else {
                                    domain.relationships["group_uses"].set(sdo.source_ref, [sdo.target_ref])
                                }
                            } else if ((sdo.source_ref.startsWith("malware") || sdo.source_ref.startsWith("tool")) && sdo.target_ref.startsWith("attack-pattern")) {
                                // record software:technique relationship
                                if (domain.relationships["software_uses"].has(sdo.source_ref)) {
                                    let ids = domain.relationships["software_uses"].get(sdo.source_ref);
                                    ids.push(sdo.target_ref);
                                } else {
                                    domain.relationships["software_uses"].set(sdo.source_ref, [sdo.target_ref])
                                }
                            }
                        } else if (sdo.relationship_type == "mitigates") {
                            if (domain.relationships["mitigates"].has(sdo.source_ref)) {
                                let ids = domain.relationships["mitigates"].get(sdo.source_ref);
                                ids.push(sdo.target_ref);
                            } else {
                                domain.relationships["mitigates"].set(sdo.source_ref, [sdo.target_ref])
                            }
                        }
                        break;
                    case "attack-pattern":
                        idToTechniqueSDO.set(sdo.id, sdo);
                        if (sdo.x_mitre_is_subtechnique) {
                            if (this.subtechniquesEnabled) {
                                domain.subtechniques.push(new Technique(sdo, [], this));
                            }
                        } else techniqueSDOs.push(sdo);
                        break;
                    case "x-mitre-tactic":
                        idToTacticSDO.set(sdo.id, sdo);
                        break;
                    case "x-mitre-matrix":
                        // addition of local tactic;
                        sdo.tactic_refs = [...sdo.tactic_refs,"x-mitre-tactic--d108ce10-2419-4cf9-a774-46161d6c6cfeAudit"]
                        matrixSDOs.push(sdo);
                        break;
                    case "note":
                        domain.notes.push(new Note(sdo));
                        break;
                }
            }

            //create techniques
            for (let techniqueSDO of techniqueSDOs) {
                let subtechniques: Technique[] = [];
                if (this.subtechniquesEnabled) {
                    if (domain.relationships.subtechniques_of.has(techniqueSDO.id)) {
                        domain.relationships.subtechniques_of.get(techniqueSDO.id).forEach((sub_id: string) => {
                            if (idToTechniqueSDO.has(sub_id)) subtechniques.push(new Technique(idToTechniqueSDO.get(sub_id), [], this));
                            // else the target was revoked or deprecated and we can skip honoring the relationship
                        })
                    }
                }
                domain.techniques.push(new Technique(techniqueSDO, subtechniques, this));
            }

            //create matrices, which also creates tactics and filters techniques
            for (let matrixSDO of matrixSDOs) {
                domain.matrices.push(new Matrix(matrixSDO, idToTacticSDO, domain.techniques, this));
            }

            // parse platforms
            for (let technique of domain.techniques) {
                for (let platform of technique.platforms) {
                    platforms.add(platform)
                }
            }
            for (let subtechnique of domain.subtechniques) {
                for (let platform of subtechnique.platforms) {
                    platforms.add(platform)
                }
            }
        }
        domain.platforms = Array.from(platforms); // convert to array

        // data loading complete; update watchers
        domain.dataLoaded = true;
        console.log("data.service parsing complete")
        for (let callback of domain.dataLoadedCallbacks) {
            callback();
        }
    }

    // Observable for data in config.json
    private configData$: Observable<Object> | any;

    // Observable for data
    private domainData$: Observable<Object> | any;

    // URLs in case config file doesn't load properly
    private enterpriseAttackURL: string = "https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json";
    private mobileAttackURL: string = "https://raw.githubusercontent.com/mitre/cti/master/mobile-attack/mobile-attack.json";

    /**
     * Set up the URLs for data
     * @param {versions} list of versions and domains defined in the configuration file
     * @memberof DataService
     */
    setUpURLs(versions: []) {
        versions.forEach((version: any) => {
            let v: string = version["name"];
            this.versions.push(v);
            version["domains"].forEach((domain: any) => {
                let id = this.getDomainID(domain["name"], v);
                let name = domain["name"];
                let domainObject = new Domain(id, name, v)

                if (domain["taxii_url"] && domain["taxii_collection"]) {
                    domainObject.taxii_url = domain["taxii_url"];
                    domainObject.taxii_collection = domain["taxii_collection"];
                } else {
                    domainObject.urls = domain["data"]
                }
                this.domains.push(domainObject);
            });
        });

        if (this.domains.length == 0) { // issue loading config
            let currVersion = "ATT&CK v7";
            let enterpriseDomain = new Domain(this.getDomainID("Enterprise", currVersion), "Enterprise", currVersion);
            enterpriseDomain.urls = [this.enterpriseAttackURL];
            let mobileDomain = new Domain(this.getDomainID("Mobile", currVersion), "Mobile", currVersion);
            mobileDomain.urls = [this.mobileAttackURL];

            this.versions.push(currVersion);
            this.domains.push(enterpriseDomain);
            this.domains.push(mobileDomain);
            console.log(this.domains)
        }
    }

    /**
     * get the current config
     * @param {boolean} refresh: if true fetches the config from file. Otherwise, only fetches if it's never been fetched before
     */
    getConfig(refresh: boolean = false) {
        if (refresh || !this.configData$) {
            this.configData$ = this.http.get("./assets/config.json");
        }
        return this.configData$;
    }

    /**
     * Fetch the domain data from the endpoint
     */
    getDomainData(domain: any, refresh: boolean = false): Observable<Object> {
        if (domain.taxii_collection && domain.taxii_url) {
            console.log("fetching data from TAXII server");
            let conn = new TaxiiConnect(domain.taxii_url, '', '', 5000);
            let collectionInfo: any = {
                'id': domain.taxii_collection,
                'title': domain.name,
                'description': '',
                'can_read': true,
                'can_write': false,
                'media_types': ['application/vnd.oasis.stix+json']
            }
            const collection = new Collection(collectionInfo, domain.taxii_url + 'stix', conn);
            this.domainData$ = forkJoin([from(collection.getObjects('', undefined))]);
        } else if (refresh || !this.domainData$) {
            console.log("retrieving data", domain.urls)
            let bundleData: Observable<Object>[] = [];
            domain.urls.forEach((url: any) => {
                bundleData.push(this.http.get(url));
            });

            this.domainData$ = forkJoin(bundleData);
        }
        return this.domainData$;
    }

    /**
     * Load and parse domain data
     */
    loadDomainData(domainID: string, refresh: boolean = false): Promise<any> {
        let dataPromise: Promise<any> = new Promise((resolve, reject) => {
            let domain = this.getDomain(domainID);
            if (domain) {
                let subscription = this.getDomainData(domain, refresh).subscribe({
                    next: (data: any) => {
                     data[0].objects = [ ...data[0].objects,
                            {
                                "external_references": [
                                    {
                                        "source_name": "mitre-attack",
                                        "external_id": "T15477",
                                        "url": "https://attack.mitre.org/techniques/T1548"
                                    }
                                ],
                                "object_marking_refs": [
                                    "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
                                ],
                                "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
                                "name": "Unassigned",
                                "description": "Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system.",
                                "id": "attack-pattern--67720091-eee3-4d2d-ae16-8264567f6f5bUnAss",
                                "type": "attack-pattern",
                                "kill_chain_phases": [
                                    {
                                        "kill_chain_name": "mitre-attack",
                                        "phase_name": "privilege-escalation"
                                    },
                                    {
                                        "kill_chain_name": "mitre-attack",
                                        "phase_name": "defense-evasion"
                                    },
                                    {
                                        "kill_chain_name": "mitre-attack",
                                        "phase_name": "audit"
                                    }
                                ],
                                "modified": "2020-07-22T21:36:52.825Z",
                                "created": "2020-01-30T13:58:14.373Z",
                                "x_mitre_data_sources": [
                                    "Process: Process Metadata",
                                    "Process: Process Creation",
                                    "Windows Registry: Windows Registry Key Modification",
                                    "Command: Command Execution",
                                    "File: File Metadata",
                                    "File: File Modification",
                                    "Process: OS API Execution"
                                ],
                                "x_mitre_permissions_required": [
                                    "Administrator",
                                    "User"
                                ],
                                "x_mitre_detection": "Monitor the file system for files that have the setuid or setgid bits set. Also look for any process API calls for behavior that may be indicative of [Process Injection](https://attack.mitre.org/techniques/T1055) and unusual loaded DLLs through [DLL Search Order Hijacking](https://attack.mitre.org/techniques/T1574/001), which indicate attempts to gain access to higher privileged processes. On Linux, auditd can alert every time a user's actual ID and effective ID are different (this is what happens when you sudo).\n\nConsider monitoring for <code>/usr/libexec/security_authtrampoline</code> executions which may indicate that AuthorizationExecuteWithPrivileges is being executed. MacOS system logs may also indicate when AuthorizationExecuteWithPrivileges is being called. Monitoring OS API callbacks for the execution can also be a way to detect this behavior but requires specialized security tooling.\n\nOn Linux, auditd can alert every time a user's actual ID and effective ID are different (this is what happens when you sudo). This technique is abusing normal functionality in macOS and Linux systems, but sudo has the ability to log all input and output based on the <code>LOG_INPUT</code> and <code>LOG_OUTPUT</code> directives in the <code>/etc/sudoers</code> file.\n\nThere are many ways to perform UAC bypasses when a user is in the local administrator group on a system, so it may be difficult to target detection on all variations. Efforts should likely be placed on mitigation and collecting enough information on process launches and actions that could be performed before and after a UAC bypass is performed. Some UAC bypass methods rely on modifying specific, user-accessible Registry settings. Analysts should monitor Registry settings for unauthorized changes.",
                                "x_mitre_version": "1.0",
                                "x_mitre_is_subtechnique": false,
                                "x_mitre_platforms": [
                                    "Linux",
                                    "macOS",
                                    "Windows"
                                ]
                            },
                            {
                                "id": "x-mitre-tactic--d108ce10-2419-4cf9-a774-46161d6c6cfeAudit",
                                "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
                                "name": "Audit",
                                "description": "Misselenious",
                                "external_references": [
                                  {
                                    "external_id": "TA0009",
                                    "url": "https://attack.mitre.org/tactics/TA0009",
                                    "source_name": "mitre-attack"
                                  }
                                ],
                                "object_marking_refs": [
                                  "marking-definition--fa42a846-8d90-4e51-bc29-71d5b4802168"
                                ],
                                "x_mitre_shortname": "audit",
                                "type": "x-mitre-tactic",
                                "modified": "2019-07-19T17:44:53.176Z",
                                "created": "2018-10-17T00:14:20.652Z"
                              }
                        ]
                        this.parseBundle(domain, data);
                        resolve(null);
                    },
                    complete: () => { if (subscription) subscription.unsubscribe(); } //prevent memory leaks
                });
            } else if (!domain) { // domain not defined in config
                reject("'" + domainID + "' is not a valid domain.")
            }
        });
        return dataPromise;
    }

    /**
     * Get domain object by domain ID
     */
    getDomain(domainID: string): Domain | any {
        return this.domains.find((d) => d.id === domainID);
    }

    /**
     * Get domain ID from domain name & version
     */
    getDomainID(domain: string, version: string): string {
        if (!version) { // layer with no specified version defaults to current version
            version = this.versions[0];
        }
        return domain.replace(/\s/g, "-").concat('-', version.replace(/\s/g, "-").replace("&", "a").toLowerCase()).toLowerCase();
    }

    /**
     * Retrieves the first version defined in the config file
     */
    getCurrentVersion() {
        return this.versions[0].match(/v[0-9]/g)[0].toLowerCase();
    }

    /**
     * Is the given version supported?
     */
    isSupported(version: string | any) {
        return version.match(/[0-9]/g)[0] < this.versions[this.versions.length - 1].match(/[0-9]/g)[0] ? false : true;
    }
}

/**
 * Common attributes for STIX objects
 */
export abstract class BaseStix {
    public readonly id: string;          // STIX ID
    public readonly attackID: string;    // ATT&CK ID
    public readonly name: string;        // name of object
    public readonly description: string; // description of object
    public readonly url: string;         // URL of object on the ATT&CK website
    protected readonly dataService: DataService;
    constructor(stixSDO: any, dataService: DataService) {
        this.id = stixSDO.id;
        this.name = stixSDO.name;
        this.description = stixSDO.description;
        this.attackID = stixSDO.external_references[0].external_id;
        this.url = stixSDO.external_references[0].url;
        this.dataService = dataService;
    }
}

/**
 * Object representing an ATT&CK matrix (x-mitre-matrix)
 */
export class Matrix extends BaseStix {
    public readonly tactics: Tactic[]; //tactics found under this Matrix
    /**
     * Creates an instance of Matrix.
     * @param {*} stixSDO for the matrix
     * @param {Map<string, any>} idToTacticSDO map of tactic ID to tactic SDO
     * @param {Technique[]} techniques all techniques defined in the domain
     */
    constructor(stixSDO: any, idToTacticSDO: Map<string, any>, techniques: Technique[], dataService: DataService) {
        super(stixSDO, dataService);
        this.tactics = stixSDO.tactic_refs.map((tacticID: string) => new Tactic(idToTacticSDO.get(tacticID), techniques, this.dataService))
    }
}

/**
 * Object representing a Tactic (x-mitre-tactic) in the ATT&CK matrix
 */
export class Tactic extends BaseStix {
    public readonly techniques: Technique[];  // techniques found under this tactic
    public readonly shortname: string;        // shortname property, AKA phase-name for techniques' kill-chain phases
    /**
     * Creates an instance of Tactic.
     * @param {*} stixSDO for the tactic
     * @param {Technique[]} techniques all techniques in the domain
     */
    constructor(stixSDO: any, techniques: Technique[], dataService: DataService) {
        super(stixSDO, dataService);
        this.shortname = stixSDO.x_mitre_shortname;
        this.techniques = techniques.filter((technique: Technique) => technique.tactics.includes(this.shortname));
    }
}
/**
 * Object representing a Technique (attack-pattern) in the ATT&CK matrix
 */
export class Technique extends BaseStix {
    public readonly platforms: string[];        // platforms for this technique.
    public readonly tactics: string[];          // tactics this technique is found under in phase-name format
    public readonly subtechniques: Technique[]; // subtechniques under this technique
    public readonly datasources: string;        // data sources of the technique
    public parent: Technique | any = null;            // parent technique. Only present if it's a sub-technique
    public get isSubtechnique() { return this.parent != null; }
    /**
     * Creates an instance of Technique.
     * @param {*} stixSDO for the technique
     * @param {Technique[]} subtechniques occuring under the technique
     */
    constructor(stixSDO: any, subtechniques: Technique[], dataService: DataService) {
        super(stixSDO, dataService);
        this.platforms = stixSDO.x_mitre_platforms;
        if (stixSDO.x_mitre_data_sources !== undefined)
            this.datasources = stixSDO.x_mitre_data_sources.toString();
        else
            this.datasources = "";
        this.tactics = stixSDO.kill_chain_phases.map((phase: { phase_name: any; }) => phase.phase_name);

        this.subtechniques = subtechniques;
        for (let subtechnique of this.subtechniques) {
            subtechnique.parent = this;
        }

    }

    /**
     * Get an ID identifying this technique under a specific tactic
     * @param {string|Tactic} tactic tactic name in phase-name/shortname format, or a Tactic object itself
     * @returns {string} ID for this technique under that tactic
     */
    public get_technique_tactic_id(tactic: string | Tactic): string {
        let tactic_shortname = tactic instanceof Tactic ? tactic.shortname : tactic;
        if (!this.tactics.includes(tactic_shortname)) throw new Error(tactic_shortname + " is not a tactic of " + this.attackID);
        return this.attackID + "^" + tactic_shortname;
    }

    /**
     * Get all possible IDs identifying this technique under tactics
     * Basically the same as calling get_technique_tactic_id with all valid tactic values
     */
    public get_all_technique_tactic_ids(): string[] {
        return this.tactics.map((shortname: string) => this.get_technique_tactic_id(shortname));
    }
}

/**
 * Object representing a Software (tool, malware) in the ATT&CK catalogue
 */
export class Software extends BaseStix {
    public readonly platforms: string[] = []; //platforms for this software

    /**
     * Creates an instance of Software.
     * @param {*} stixSDO for the software
     * @param {DataService} DataService the software occurs within
    */
    constructor(stixSDO: any, dataService: DataService) {
        super(stixSDO, dataService);
        this.platforms = stixSDO.x_mitre_platforms;
    }

    /**
     * get techniques used by this software
     * @returns {string[]} technique IDs used by this software
     */
    public used(domainID: string): string[] {
        let rels = this.dataService.getDomain(domainID).relationships.software_uses;
        if (rels.has(this.id)) return rels.get(this.id);
        else return [];
    }
    /**
     * Return all related techniques
     */
    public relatedTechniques(domainID: any): string[] {
        return this.used(domainID);
    }
}
/**
 * Object representing a Group (intrusion-set) in the ATT&CK catalogue
 */
export class Group extends BaseStix {
    /**
     * get techniques used by this group
     * @returns {string[]} technique IDs used by this group
     */
    public used(domainID: string): string[] {
        let rels = this.dataService.getDomain(domainID).relationships.group_uses;
        if (rels.has(this.id)) {
            let o = rels.get(this.id)
            return o;
        }
        else return [];
    }
    /**
     * Return all related techniques
     */
    public relatedTechniques(domainID: any): string[] {
        return this.used(domainID);
    }
}

/**
 * Object representing a Mitigation (course-of-action) in the ATT&CK catalogue
 */
export class Mitigation extends BaseStix {
    /**
     * get techniques mitigated by this mitigation
     * @returns {string[]} list of technique IDs
     */
    public mitigated(domainID: string): string[] {
        let rels = this.dataService.getDomain(domainID).relationships.mitigates;
        if (rels.has(this.id)) {
            return rels.get(this.id);
        }
        else return [];
    }
    /**
     * Return all related techniques
     */
    public relatedTechniques(domainID: any): string[] {
        return this.mitigated(domainID);
    }
}

export class Note {
    public readonly abstract?: string; // brief summary of note content
    public readonly content: string; // content of the note
    public readonly object_refs: string[]; // list of STIX objects the note is applied to

    /**
     * Creates an instance of Note.
     * @param {*} stixSDO for the note
    */
    constructor(stixSDO: any) {
        if (stixSDO.abstract) this.abstract = stixSDO.abstract;
        this.content = stixSDO.content;
        this.object_refs = stixSDO.object_refs;
    }
}

export class Domain {
    public readonly id: string; // domain ID
    public readonly name: string; // domain display name
    public readonly version: string | any; // ATT&CK version number

    public urls: string[] = [];
    public taxii_url: string = "";
    public taxii_collection: string = "";
    public dataLoaded: boolean = false;
    public dataLoadedCallbacks: any[] = [];

    public matrices: Matrix[] = [];
    public tactics: Tactic[] = [];
    public techniques: Technique[] = [];
    public platforms: String[] = []; // platforms defined on techniques and software of the domain
    public subtechniques: Technique[] = [];
    public software: Software[] = [];
    public groups: Group[] = [];
    public mitigations: Mitigation[] = [];
    public notes: Note[] = [];
    public relationships: any = {
        // subtechnique subtechnique-of technique
        // ID of technique to [] of subtechnique IDs
        subtechniques_of: new Map<string, string[]>(),
        // group uses technique
        // ID of group to [] of technique IDs
        group_uses: new Map<string, string[]>(),
        // group uses technique
        // ID of group to [] of technique IDs
        software_uses: new Map<string, string[]>(),
        // mitigation mitigates technique
        // ID of mitigation to [] of technique IDs
        mitigates: new Map<string, string[]>()
    }

    constructor(id: string, name: string, version: string) {
        this.id = id;
        this.name = name;
        this.version = version;
    }

    /**
     * Get version of this domain
     */
    getVersion() {
        return this.version.match(/[0-9]/g)[0];
    }
}

import { Injectable } from '@angular/core';
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class GenerateHeatmapJsonService {
    selectedDomainId = "enterprise-attack-v9";
    techniqueToTacticSet;
    domainTechniquesList = [];
    jsonTemplate = {
        "name": "layer",
        "versions": {
            "attack": "9",
            "navigator": "4.3",
            "layer": "4.2"
        },
        "domain": "enterprise-attack",
        "description": "",
        "filters": {
            "platforms": [
                "Linux",
                "macOS",
                "Windows",
                "Azure AD",
                "Office 365",
                "SaaS",
                "IaaS",
                "Google Workspace",
                "PRE",
                "Network",
                "Containers"
            ]
        },
        "sorting": 0,
        "layout": {
            "layout": "side",
            "aggregateFunction": "average",
            "showID": false,
            "showName": true,
            "showAggregateScores": false,
            "countUnscored": false
        },
        "hideDisabled": false,
        "techniques": [],
        "gradient": {
            "colors": [
                "#ff6666",
                "#ffe766",
                "#8ec843"
            ],
            "minValue": 0,
            "maxValue": 100
        },
        "legendItems": [],
        "metadata": [],
        "showTacticRowBackground": false,
        "tacticRowBackground": "#dddddd",
        "selectTechniquesAcrossTactics": true,
        "selectSubtechniquesWithParent": false
    };
    useCasesJson = {
        "usecaseData": [
            {
                "name": "Vir/Malwr-Security Event-Base64 Encoded PE file",
                "description": "<p><span style=\"color:#032F62\">This use case detects and creates alerts when it identifies instances of a base64 encoded PE file header is detected in the process command line parameter</span>. </p>",
                "id": "MUCK-0012",
                "industry": [
                    "Retail",
                    "Transportation & Logistics"
                ],
                "logSourceTypes": [
                    "Endpoint-system events"
                ],
                "killChain": [
                    "Exploitation",
                    "Command & Control"
                ],
                "automationMaturity": "Partially automated",
                "detectionSourceLogic": "<p>If event = PE file header (TVqQAAMAAAAEAAA) seen in command line parameter then </p><p> fire alert</p><p>endif</p>",
                "enrichmentDataCollection": "<p>Encoding malicious software is a technique used to obfuscate files from detection.<br>The first CommandLine component is looking for Python decoding base64.<br>The second CommandLine component is looking for Bash/sh command line base64 decoding.<br>The third one is looking for Ruby decoding base64.</p><p>An unknown process was executed from a binary file – hidden in Base64 encoded file. This obfuscation technique is used mostly by malware, trying to hide its activity inside the network. It is likely that more than one machine is involved in this incident, and the Base64 encoded file was used to transfer the payload in a stealthy way between the infected machines.</p><p><span style=\"color:#222222;\">When hunting for suspicious activity, it's always a good idea to search for Microsoft Executables. They are easy to identify: They start with the characters \"MZ\" at the beginning of the file[</span><a href=\"https://en.m.wikipedia.org/wiki/DOS_MZ_executable\">1</a><span style=\"color:#222222;\">]. But, to bypass classic controls, those files are often obfuscated (XOR, Rot13 or Base64)</span><b>. </b></p><p><b></b><br></p><ul>\n<li><p>After Log Collection Prerequisites Please cross check with the following steps as well(Windows)</p></li>\n<li><p><b>Use the Logon ID to correlate with Event Code 4624 obtain the User information who has initiated this process. Check the User is authorised to initiate these services.</b></p></li>\n<li><p><b>To avoid noise of System initiated Processes, please Correlate EventCode 4688 with Token Elevated Type \"TokenElevationTypeFull (2)\" for User related events. </b></p></li>\n<li><p><b>Use Creator Process ID and Host Name and investigate backwards to check when did this Creator Process ID was observed as New Process ID and obtain the information Process Name &amp; Process Command Line (Continue the investigation until you reach the initial Process ID)</b></p></li>\n<li><p><b>Monitor and correlate the event occurring at the same time as Event Code 4696 to get more information about the New Process.</b> </p></li>\n<li><p>Validate when Base64 file was created on system and how it was created. If not legit - check anti-virus signatures for remediation. </p></li>\n</ul>",
                "ciaImpact": [
                    "Confidentiality"
                ],
                "threatCategory": "Virus/Malware activity Events",
                "threatType": [
                    "Virus/Malware",
                    "APT/0-Day"
                ],
                "mitreTechniques": [
                    "Command and Scripting Interpreter",
                    "Deobfuscate/Decode Files or Information"
                ],
                "mitreAttackTactics": [
                    "Execution",
                    "Defense Evasion"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Execution",
                        "tacticId": "TA0002",
                        "technique": [
                            {
                                "technique": "Command and Scripting Interpreter",
                                "techniqueId": "T1059"
                            }
                        ]
                    },
                    {
                        "tactic": "Defense Evasion",
                        "tacticId": "TA0005",
                        "technique": [
                            {
                                "technique": "Deobfuscate/Decode Files or Information",
                                "techniqueId": "T1140"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Account-Priv-Local Account Created.",
                "description": "<p>This use case detects and creates alerts when a local account is created on a host. A local account is a common method for an Attacker to gain persistence in a System, and creating this artifact allows to user to set a foothold can provide an entry point for future access.</p>",
                "id": "MUCK-0004",
                "industry": [
                    "Insurance & Investment Management"
                ],
                "logSourceTypes": [
                    "AAA system events",
                    "Cloud-AWS events",
                    "Cloud-Azure events",
                    "Endpoint-system events"
                ],
                "killChain": [
                    "Exploitation"
                ],
                "automationMaturity": "Partially automated",
                "detectionSourceLogic": "<p>if \"Create Account Event\", then \"Fire Event\"</p>",
                "enrichmentDataCollection": "<p>Collect Event Information (Source of request, Target system and Target user account that was created)</p><p>Access threat intel for similar activity on target account, system, source. (has this account creation been linked to a threat)</p><p>If intel provides known remediation path - Execute Response 1. Do post-anlaysis investigation</p><p>else</p><p>Execute Analysis</p><p>endif</p><p></p><p></p><p style=\"text-align:start;\"><b>Local Account created</b></p><p style=\"text-align:left;\">Local accounts are those configured by an organization for use by users, remote support, services, or for administration on a single system or service.</p><p style=\"text-align:left;\">Password reuse may allow the abuse of local accounts across a set of machines on a network for the purposes of Privilege Escalation and Lateral Movement.</p><p style=\"text-align:start;\"><b>Potential Log Sources</b>: Security Events from windows and linux hosts</p><p style=\"text-align:start;\"><b>Events of interest:</b> </p><p style=\"text-align:start;\">For windows <a href=\"https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4720\">4720(S): A user account was created</a></p><p style=\"text-align:start;\">For Unix/Linux machines: <a href=\"https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security_guide/sec-audit_record_types\">Auditd event</a> Message types</p><h2><b>Use Ca</b></h2><p></p>",
                "ciaImpact": [
                    "Confidentiality"
                ],
                "threatCategory": "Account Based Events",
                "threatType": [
                    "Account Based Events",
                    "Privileged Account Activity"
                ],
                "mitreTechniques": [
                    "Create Account"
                ],
                "mitreAttackTactics": [
                    "Persistence",
                    "Defense Evasion",
                    "Credential Access"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Persistence",
                        "tacticId": "TA0008",
                        "technique": [
                            {
                                "technique": "Create Account",
                                "techniqueId": "T1136"
                            }
                        ]
                    },
                    {
                        "tactic": "Defense Evasion",
                        "tacticId": "TA0005",
                        "technique": [
                            {
                                "technique": "Unassigned",
                                "techniqueId": "T1548"
                            }
                        ]
                    },
                    {
                        "tactic": "Credential Access",
                        "tacticId": "TA0006",
                        "technique": [
                            {
                                "technique": "Unassigned",
                                "techniqueId": "T1548"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Account-Priv-20 Login Failures for Admin Account in Last 10 Minutes",
                "description": "<p>This use case detects and creates alerts when there is a potential Brute Force credential attacks against Administrator or Root accounts on individual systems or Domain Control systems.</p>",
                "id": "MUCK-0011",
                "industry": [
                    "Insurance & Investment Management",
                    "Transportation & Logistics"
                ],
                "logSourceTypes": [
                    "AAA system events",
                    "Cloud-AWS events",
                    "Cloud-Azure events",
                    "Endpoint-Security events",
                    "Endpoint-system events",
                    "Internet Filter events"
                ],
                "killChain": [
                    "Reconnaissance",
                    "Exploitation"
                ],
                "automationMaturity": "Partially automated",
                "detectionSourceLogic": "<p>Detection Log Sources: EDR, System Security Logs, System User Logs, Active Directory, Other AAA system.</p><p>Detection is rule is binary in nature from any source and does not require correlation between sources. It does however require correlation of like events over a specified time.</p><p>If Log Source reports 10 Failed Login Attempts on an Administrator or Root account on the same system over a period of 10 minutes or less, Then create alert. Note that a new timer must be set for every event from a given system for tracking new like events over the next 10 minutes.</p>",
                "enrichmentDataCollection": "<p><b></b></p><p><b>Initial observables within Alert:</b></p><p>System Name, potentially the current system IP address, Name of Account, number of login failures, time duration, reporting log source, Direct access or network login (if network, source of login attempt).</p><p> </p><p><b>Additional enrichment sources:</b></p><p>Inventory and Asset system: asset type and owner of target system.</p><p>Active Directory or other AAA controller: User/owner of target account.</p><p>Active Directory or other AAA controller: Users logged in to target system at time of login failure.</p><p>IF login attempt was over network access</p><ul>\n<li><p>Identification of network source</p></li>\n<li><p>Inventory and Asset system: asset type and owner of source system.</p></li>\n<li><p>Active Directory or other AAA controller: User/owner of source system.</p></li>\n<li><p>Active Directory or other AAA controller: Users logged in to source system at time of login failure.</p></li>\n</ul><p>Active Directory or other AAA controller: Time of last password change for target account.</p><p></p><p><b>Purpose</b>:</p><p><b>Purpose</b>: </p><p>The purpose of this Use Case is to detect potential Brute Force credential attacks against Administrator or Root accounts on individual systems. The alert may be the result of attempted Credential Stuffing, Password Guessing, or an automated attack.</p><p><b>Supported Log sources:</b></p><ul><li><p>Microsoft Windows &amp; Unix/Linux server</p></li></ul><p><b>Event of Interest: </b></p><ul>\n<li><p><a href=\"https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4625%20\">event - 4625 </a> (for windows servers)</p></li>\n<li><p>SSHD logs for linux</p></li>\n</ul>",
                "ciaImpact": [
                    "Confidentiality"
                ],
                "threatCategory": "Account Based Events",
                "threatType": [
                    "Account Based Events",
                    "Reconnaissance Events (Discovery)",
                    "Privileged Account Activity"
                ],
                "mitreTechniques": [
                    "Brute Force"
                ],
                "mitreAttackTactics": [
                    "Initial Access",
                    "Credential Access"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Initial Access",
                        "tacticId": "TA0001",
                        "technique": [
                            {
                                "technique": "Unassigned",
                                "techniqueId": "T1548"
                            }
                        ]
                    },
                    {
                        "tactic": "Credential Access",
                        "tacticId": "TA0006",
                        "technique": [
                            {
                                "technique": "Brute Force",
                                "techniqueId": "T1110"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "BusDis-DDoS-Bandwidth Alert For Traffic Limit Threshold",
                "description": "<p>This use case detects and creates alerts when there are potential volumetric DDoS attacks on specific Circuits or network links.</p>",
                "id": "MUCK-0035",
                "industry": [
                    "Insurance & Investment Management",
                    "Retail",
                    "Transportation & Logistics"
                ],
                "logSourceTypes": [
                    "Application events",
                    "Endpoint-system events",
                    "Internet Filter events",
                    "Network-Security Service events",
                    "Network-Traffic events"
                ],
                "killChain": [
                    "Actions on Objectives"
                ],
                "automationMaturity": "Partially automated",
                "detectionSourceLogic": "<p>If Traffic Threshold Exceeded Event or Alert Exists, THEN create Alert for SIEM. </p>",
                "enrichmentDataCollection": "<ol>\n<li><p>Identify the impact to potential target web services. This can be determined by an attempt to interact with the target services via the Internet. Service IPs or URLs will be required. If services are impacted, go to Response for Response 1.</p></li>\n<li><p>Identify the duration of the traffic spike.</p></li>\n<li><p>Determine if there are multiple sources for traffic spike.</p></li>\n<li><p>Are multiple Circuits impacted?</p></li>\n<li><p>Identify the traffic details (Mbps, top protocols, top target systems, top sources.</p></li>\n</ol>",
                "ciaImpact": [
                    "Availability",
                    "Integrity"
                ],
                "threatCategory": "Business Disruption Events",
                "threatType": [
                    "Web Based Events",
                    "Business Disruption Events",
                    "DDoS Events",
                    "Network related"
                ],
                "mitreTechniques": [
                    "Network Denial of Service"
                ],
                "mitreAttackTactics": [
                    "Execution",
                    "Impact"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Execution",
                        "tacticId": "TA0002",
                        "technique": [
                            {
                                "technique": "Unassigned",
                                "techniqueId": "T1548"
                            }
                        ]
                    },
                    {
                        "tactic": "Impact",
                        "tacticId": "TA0040",
                        "technique": [
                            {
                                "technique": "Network Denial of Service",
                                "techniqueId": "T1498"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Account-Netwrk-Multiple RDP connections from Single System",
                "description": "<p>This use case detects and creates alerts when an RDP connection is made to multiple systems and it is above the normal for the previous 7 days.</p><p><br/></p>",
                "id": "MUCK-0009",
                "industry": [
                    "Retail",
                    "Transportation & Logistics"
                ],
                "logSourceTypes": [
                    "AAA system events",
                    "Endpoint-system events",
                    "Network-Traffic events"
                ],
                "killChain": [
                    "Exploitation",
                    "Actions on Objectives"
                ],
                "automationMaturity": "Partially automated",
                "detectionSourceLogic": "<p>Use of RDP may be legitimate, depending on the network environment and how it is used. Other factors, such as access patterns and activity that occurs after a remote login, may indicate suspicious or malicious behavior with RDP. Monitor for user accounts logged into systems they would not normally access or access patterns to multiple systems over a relatively short period of time.</p><p>Also, set up process monitoring for tscon.exe usage and monitor service creation that uses cmd.exe /k or cmd.exe /c in its arguments to prevent RDP session hijacking.</p>",
                "enrichmentDataCollection": "<p>Typically, a user is notified when someone else is trying to steal their session and prompted with a question. With System permissions and using Terminal Services Console, c:\\windows\\system32\\tscon.exe [session number to be stolen], an adversary can hijack a session without the need for credentials or prompts to the user. [3] This can be done remotely or locally and with active or disconnected sessions. [4] It can also lead to Remote System Discovery and Privilege Escalation by stealing a Domain Admin or higher privileged account session. All of this can be done by using native Windows commands, but it has also been added as a feature in RedSnarf</p>",
                "ciaImpact": [
                    "Integrity",
                    "Confidentiality"
                ],
                "threatCategory": "Account Based Events",
                "threatType": [
                    "Account Based Events",
                    "Network related"
                ],
                "mitreTechniques": [
                    "Exploitation of Remote Services"
                ],
                "mitreAttackTactics": [
                    "Lateral Movement"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Lateral Movement",
                        "tacticId": "TA0008",
                        "technique": [
                            {
                                "technique": "Exploitation of Remote Services",
                                "techniqueId": "T1548"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Account-Priv-Interactive Logon with Service Accounts.",
                "description": "<p>This use case detects and creates alerts when a service account is being used to login into a system. This is being defined as a local login at the keyboard\\monitor of that system.</p><p>A service account is a user account that is created explicitly to provide a security context for services running on Server operating systems.</p>",
                "id": "MUCK-0018",
                "industry": [
                    "Insurance & Investment Management"
                ],
                "logSourceTypes": [
                    "Cloud-AWS events",
                    "Cloud-Azure events",
                    "Endpoint-system events"
                ],
                "killChain": [
                    "Exploitation",
                    "Command & Control"
                ],
                "automationMaturity": "Partially automated",
                "detectionSourceLogic": "<p>OS authentication event: successful and unsuccessful login</p><p>Create rules in SIEM to alert on OS event ID and type for:</p><p><span style=\"background-color:#F6F6F6;\">Interactive (logon at keyboard and screen of system)</span></p><p></p><p>Windows example:</p><h5 style=\"text-align:left;\"> Windows Security Log Event ID 4624</h5><table><tbody><tr>\n<td><p>2</p></td>\n<td><p>Interactive (logon at keyboard and screen of system</p></td>\n</tr></tbody></table><p></p>",
                "enrichmentDataCollection": "<ul>\n<li><p>List of valid service accounts and functions</p></li>\n<li><p>list recent events showing service acct login</p></li>\n<li><p>what: rights, role, groups membership does that service account have </p></li>\n<li><p>date and time of these logins</p></li>\n<li><p>location of system that was authenticated to interactivity \\ locally </p></li>\n<li>\n<p>information on access controls to data center, room. location of systems</p>\n<ul>\n<li><p>which users are listed as having access to these locations during time of logins</p></li>\n<li><p>badge, scanner logs, etc. during time of logins</p></li>\n</ul>\n</li>\n<li><p>track activity (event, logs) of the service account used to login to the systems after interactive login was detected</p></li>\n<li><p>This use case answers to the scenario where a local windows service account is being used to login to a system: (this is being defined as a local login at the keyboard\\monitor of that system)</p></li>\n<li><p style=\"text-align:start;\"><span style=\"color:#222222;\">A </span><b>service account</b><span style=\"color:#222222;\"> is a user </span><b>account</b><span style=\"color:#222222;\"> that is created explicitly to provide a security context for </span><b>services</b><span style=\"color:#222222;\"> running on a Server operating systems.</span></p></li>\n<li><p style=\"text-align:start;\"><b>Potential Log Sources</b>: Windows | Linux</p></li>\n<li><p style=\"text-align:start;\"><b>Events of interes</b>t: Windows Event ID <a href=\"%20https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624\">4624</a> </p></li>\n</ul>",
                "ciaImpact": [
                    "Integrity",
                    "Confidentiality"
                ],
                "threatCategory": "Account Based Events",
                "threatType": [
                    "Privileged Account Activity",
                    "User Activity"
                ],
                "mitreTechniques": [
                    "Valid Accounts",
                    "Exploitation for Privilege Escalation"
                ],
                "mitreAttackTactics": [
                    "Initial Access",
                    "Privilege Escalation",
                    "Credential Access"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Initial Access",
                        "tacticId": "TA0001",
                        "technique": [
                            {
                                "technique": "Valid Accounts",
                                "techniqueId": "T1078"
                            }
                        ]
                    },
                    {
                        "tactic": "Privilege Escalation",
                        "tacticId": "TA0004",
                        "technique": [
                            {
                                "technique": "Valid Accounts",
                                "techniqueId": "T1078"
                            },
                            {
                                "technique": "Exploitation for Privilege Escalation",
                                "techniqueId": "T1068"
                            }
                        ]
                    },
                    {
                        "tactic": "Credential Access",
                        "tacticId": "TA0006",
                        "technique": [
                            {
                                "technique": "Unassigned",
                                "techniqueId": "T1548"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Account-Netwrk- RDP Nesting",
                "description": "<p>This use case detects and creates alerts when a remote access session is started within another session.</p>",
                "id": "MUCK-0024",
                "industry": [
                    "Retail",
                    "Transportation & Logistics"
                ],
                "logSourceTypes": [
                    "AAA system events",
                    "Endpoint-system events",
                    "Network-Traffic events"
                ],
                "killChain": [
                    "Reconnaissance",
                    "Exploitation"
                ],
                "automationMaturity": "Partially automated",
                "detectionSourceLogic": "<p></p>",
                "enrichmentDataCollection": "<p>Typically, a user is notified when someone else is trying to steal their session and prompted with a question. With System permissions and using Terminal Services Console, c:\\windows\\system32\\tscon.exe [session number to be stolen], an adversary can hijack a session without the need for credentials or prompts to the user. [3] This can be done remotely or locally and with active or disconnected sessions. [4] It can also lead to Remote System Discovery and Privilege Escalation by stealing a Domain Admin or higher privileged account session. All of this can be done by using native Windows commands, but it has also been added as a feature in RedSnarf</p>",
                "ciaImpact": [
                    "Integrity",
                    "Confidentiality"
                ],
                "threatCategory": "Account Based Events",
                "threatType": [
                    "Network related"
                ],
                "mitreTechniques": [
                    "Exploitation of Remote Services",
                    "Remote Services: Remote Desktop Protocol"
                ],
                "mitreAttackTactics": [
                    "Initial Access",
                    "Lateral Movement"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Initial Access",
                        "tacticId": "TA0001",
                        "technique": [
                            {
                                "technique": "Unassigned",
                                "techniqueId": "T1548"
                            }
                        ]
                    },
                    {
                        "tactic": "Lateral Movement",
                        "tacticId": "TA0008",
                        "technique": [
                            {
                                "technique": "Exploitation of Remote Services",
                                "techniqueId": "T1210"
                            },
                            {
                                "technique": "Remote Services: Remote Desktop Protocol",
                                "techniqueId": "T1021"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Account-Netwrk-Rare RDP Connections",
                "description": "<p>This use case detects and creates an alert when an RDP connection is new or rare related to any login type by a given account today, based on comparison with the previous 14 days. </p>",
                "id": "MUCK-0026",
                "industry": [
                    "Retail",
                    "Transportation & Logistics"
                ],
                "logSourceTypes": [
                    "AAA system events",
                    "Endpoint-system events",
                    "Network-Traffic events"
                ],
                "killChain": [
                    "Exploitation",
                    "Actions on Objectives"
                ],
                "automationMaturity": "Partially automated",
                "detectionSourceLogic": "<p>Use of RDP may be legitimate, depending on the network environment and how it is used. Other factors, such as access patterns and activity that occurs after a remote login, may indicate suspicious or malicious behavior with RDP. Monitor for user accounts logged into systems they would not normally access or access patterns to multiple systems over a relatively short period of time.</p><p>Also, set up process monitoring for <code>tscon.exe</code> usage and monitor service creation that uses <code>cmd.exe /k</code> or <code>cmd.exe /c</code> in its arguments to prevent RDP session hijacking.</p><p></p><p>name: Rare RDP Connections\r</p><p>description: |\r</p><p>  'Identifies when an RDP connection is new or rare related to any logon type by a given account today based on comparison with the previous 14 days.\r</p><p>  RDP connections are indicated by the EventID 4624 with LogonType = 10'\r</p><p>severity: Medium\r</p><p>requiredDataConnectors:\r</p><p>  - connectorId: SecurityEvents\r</p><p>    dataTypes:\r</p><p>      - SecurityEvent\r</p><p>queryFrequency: 1d\r</p><p>queryPeriod: 14d\r</p><p>triggerOperator: gt\r</p><p>triggerThreshold: 0\r</p><p>tactics:\r</p><p>  - LateralMovement\r</p><p>relevantTechniques:\r</p><p>  - T1076\r</p><p>query: |\r</p><p>  let starttime = 1d;\r</p><p>  let endtime = 14d;\r</p><p>  SecurityEvent\r</p><p>  | where TimeGenerated &gt;= ago(endtime) \r</p><p>  | where EventID == 4624 and LogonType == 10\r</p><p>  | summarize StartTimeUtc = min(TimeGenerated), EndTimeUtc = max(TimeGenerated), ConnectinCount = count() \r</p><p>  by Account = tolower(Account), Computer = toupper(Computer), IpAddress, AccountType, Activity, LogonTypeName, ProcessName\r</p><p>  // use left anti to exclude anything from the previous 14 days that is not rare\r</p><p>  | join kind=leftanti (\r</p><p>  SecurityEvent\r</p><p>  | where TimeGenerated between (ago(starttime) .. ago(endtime))\r</p><p>  | where EventID == 4624\r</p><p>  | summarize by Computer = toupper(Computer), IpAddress, Account = tolower(Account)\r</p><p>  ) on Account, Computer\r</p><p>  | summarize StartTimeUtc = min(StartTimeUtc), EndTimeUtc = max(EndTimeUtc), ConnectinCount = sum(ConnectinCount)  \r</p><p>  by Account, Computer, IpAddress, AccountType, Activity, LogonTypeName, ProcessName\r</p><p>  | extend timestamp = StartTimeUtc, AccountCustomEntity = Account, HostCustomEntity = Computer, IPCustomEntity = IpAddress</p>",
                "enrichmentDataCollection": "<p>Typically, a user is notified when someone else is trying to steal their session and prompted with a question. With System permissions and using Terminal Services Console, <code>c:\\windows\\system32\\tscon.exe [session number to be stolen]</code>, an adversary can hijack a session without the need for credentials or prompts to the user. <a href=\"http://www.korznikov.com/2017/03/0-day-or-feature-privilege-escalation.html\">[3]</a> This can be done remotely or locally and with active or disconnected sessions. <a href=\"https://medium.com/@networksecurity/rdp-hijacking-how-to-hijack-rds-and-remoteapp-sessions-transparently-to-move-through-an-da2a1e73a5f6\">[4]</a> It can also lead to <a href=\"https://attack.mitre.org/techniques/T1018\">Remote System Discovery</a> and Privilege Escalation by stealing a Domain Admin or higher privileged account session. All of this can be done by using native Windows commands, but it has also been added as a feature in RedSnarf</p><p><b>Rare RDP Connections</b></p><p>Identifies when an RDP connection is new or rare related to any logon type by a given account today based on comparison with the previous 14 days. RDP connections are indicated by the <a href=\"https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=4624\">EventID 4624</a> with LogonType = 10.</p><p><b>Purpose</b>: </p><p>The purpose of this guideline is to provide a procedure of how to investigate when a new or rare RDP connection is detected based on the comparison with the previous 14 days.</p><p><b>Potential Log Sources</b>: SecurityEvents </p><p><b>Events of interest</b>: SecurityEvent</p>",
                "ciaImpact": [
                    "Confidentiality"
                ],
                "threatCategory": "Account Based Events",
                "threatType": [
                    "Behavioral Analysis Events",
                    "Network related"
                ],
                "mitreTechniques": [
                    "Exploitation of Remote Services",
                    "Remote Services: Remote Desktop Protocol"
                ],
                "mitreAttackTactics": [
                    "Initial Access",
                    "Lateral Movement"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Initial Access",
                        "tacticId": "TA0001",
                        "technique": [
                            {
                                "technique": "Unassigned",
                                "techniqueId": "T1548"
                            }
                        ]
                    },
                    {
                        "tactic": "Lateral Movement",
                        "tacticId": "TA0008",
                        "technique": [
                            {
                                "technique": "Exploitation of Remote Services",
                                "techniqueId": "T1210"
                            },
                            {
                                "technique": "Remote Services: Remote Desktop Protocol",
                                "techniqueId": "T1021"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Account-User-Failed logon attempts within 10 mins",
                "description": "<p>This use case detects and creates an alert when there are 20 or more failed authentication login attempts during 10 minutes. </p><p><br/></p><p><a href=\"https://ust-global-digital.aha.io/shared/179a5fa9ab0b941f1ba8913edf1a1764\"><strong><span style=\"color:#0070C0\">Azure Sentinel Rules   </span></strong></a><strong><span style=\"color:#0070C0\"></span></strong></p><p><a href=\"https://ust-global-digital.aha.io/shared/179a5fa9ab0b941f1ba8913edf1a1764\"><span style=\"color:#0070C0\"><strong>IBM Security QRadar Rules</strong></span></a></p><p><a href=\"https://ust-global-digital.aha.io/shared/179a5fa9ab0b941f1ba8913edf1a1764\"><span style=\"color:#0070C0\"><strong>Splunk ES Queries Rules </strong></span></a></p><p><a href=\"https://ust-global-digital.aha.io/shared/179a5fa9ab0b941f1ba8913edf1a1764\"><span style=\"color:#0070C0\"><strong>ArcSight Rules</strong></span></a></p><p><br/></p>",
                "id": "MUCK-0031",
                "industry": [
                    "Retail",
                    "Transportation & Logistics"
                ],
                "logSourceTypes": [
                    "AAA system events",
                    "Endpoint-system events",
                    "Office events"
                ],
                "killChain": [
                    "Reconnaissance",
                    "Delivery",
                    "Exploitation"
                ],
                "automationMaturity": "Manual Playbook",
                "detectionSourceLogic": "<p>It is difficult to detect when hashes are cracked, since this is generally done outside the scope of the target network. </p><p>Monitor authentication logs for system and application login failures of <a href=\"https://attack.mitre.org/techniques/T1078\">Valid Accounts</a>. If authentication failures are high, then there may be a brute force attempt to gain access to a system using legitimate credentials.</p><p>Also monitor for many failed authentication attempts across various accounts that may result from password spraying attempts.</p><p>For password spraying consider the following<a href=\"https://www.trimarcsecurity.com/single-post/2018/05/06/Trimarc-Research-Detecting-Password-Spraying-with-Security-Event-Auditing\">[30]</a>:</p><ul>\n<li><p>Domain Controllers: \"Audit Logon\" (Success &amp; Failure) for event ID 4625.</p></li>\n<li><p>Domain Controllers: \"Audit Kerberos Authentication Service\" (Success &amp; Failure) for event ID 4771.</p></li>\n<li><p>All systems: \"Audit Logon\" (Success &amp; Failure) for event ID 4648.</p></li>\n</ul><p></p><p>name: Failed logon attempts within 10 mins\r</p><p>description: |\r</p><p>  'Identifies when failed logon attempts are 20 or higher during a 10 minute period (2 failed logons per minute minimum).'\r</p><p>severity: Low\r</p><p>requiredDataConnectors:\r</p><p>  - connectorId: SecurityEvents\r</p><p>    dataTypes:\r</p><p>      - SecurityEvent\r</p><p>queryFrequency: 10m\r</p><p>queryPeriod: 10m\r</p><p>triggerOperator: gt\r</p><p>triggerThreshold: 0\r</p><p>tactics:\r</p><p>  - CredentialAccess\r</p><p>relevantTechniques:\r</p><p>  - T1110\r</p><p>query: |\r</p><p>  let timeframe = 10m;\r</p><p>  let threshold = 20;\r</p><p>  SecurityEvent \r</p><p>  | where TimeGenerated &gt;= ago(timeframe)\r</p><p>  | where EventID == 4625\r</p><p>  | where AccountType =~ \"User\"\r</p><p>  | summarize min(TimeGenerated), max(TimeGenerated), FailedLogonCount = count() by EventID, Activity, WorkstationName, Account, \r</p><p>  TargetAccount, TargetUserName, TargetDomainName, LogonType, LogonTypeName, LogonProcessName, Status, SubStatus\r</p><p>  | where FailedLogonCount &gt;= threshold\r</p><p>  | project StartTimeUtc = min_TimeGenerated, EndTimeUtc = max_TimeGenerated, FailedLogonCount, EventID, Activity, WorkstationName, \r</p><p>  Account, TargetAccount, TargetUserName, TargetDomainName, LogonType, LogonTypeName, LogonProcessName, Status, SubStatus\r</p><p>  | extend timestamp = StartTimeUtc, AccountCustomEntity = Account, HostCustomEntity = WorkstationName</p>",
                "enrichmentDataCollection": "<p></p>",
                "ciaImpact": [
                    "Integrity",
                    "Confidentiality"
                ],
                "threatCategory": "Account Based Events",
                "threatType": [
                    "Account Based Events",
                    "Reconnaissance Events (Discovery)",
                    "Configuration Changes",
                    "User Activity"
                ],
                "mitreTechniques": [
                    "Brute Force",
                    "Brute Force: Credential Stuffing",
                    "Brute Force: Password Cracking",
                    "Brute Force: Password Guessing",
                    "Brute Force: Password Spraying"
                ],
                "mitreAttackTactics": [
                    "Credential Access"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Credential Access",
                        "tacticId": "TA0006",
                        "technique": [
                            {
                                "technique": "Brute Force",
                                "techniqueId": "T1110"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Recon-Netwrk-Port Scan from Internal Network",
                "description": "<p>This use case creates alerts when an unauthorized scan is attempting to get a listing of services running on remote hosts, including those that may be vulnerable to remote software exploitation.</p>",
                "id": "MUCK-0017",
                "industry": [
                    "Insurance & Investment Management"
                ],
                "logSourceTypes": [
                    "Endpoint-system events",
                    "Network-Traffic events"
                ],
                "killChain": [
                    "Reconnaissance"
                ],
                "automationMaturity": "Partially automated",
                "detectionSourceLogic": "<p>If scan detected fire off alert</p>",
                "enrichmentDataCollection": "<p>If scan is authorized do nothing.  If scan is not authorized investigate offending IP and host.  Check other security systems for concurrent attacks.</p>",
                "ciaImpact": [
                    "Confidentiality"
                ],
                "threatCategory": "Reconnaissance Events (Discovery)",
                "threatType": [
                    "Network related"
                ],
                "mitreTechniques": [
                    "Network Sniffing",
                    "Network Service Scanning",
                    "System Network Connections Discovery"
                ],
                "mitreAttackTactics": [
                    "Discovery"
                ],
                "siemPlatform": [
                    "Sentinel"
                ],
                "usage": [],
                "mapping": [
                    {
                        "tactic": "Discovery",
                        "tacticId": "TA0007",
                        "technique": [
                            {
                                "technique": "Network Sniffing",
                                "techniqueId": "T1040"
                            },
                            {
                                "technique": "Network Service Scanning",
                                "techniqueId": "T1046"
                            },
                            {
                                "technique": "System Network Connections Discovery",
                                "techniqueId": "T1049"
                            }
                        ]
                    }
                ]
            }
        ]
    }

    constructor(
        private ds: DataService,
    ) {
    }
    getDomainTechniqueList() {
        try {
            this.domainTechniquesList = this.ds.getDomain(this.selectedDomainId).techniques;
            console.log("TechniquesList ", this.domainTechniquesList);

        } catch (error) {
            console.error(error)
        }
    }
    usecasesListWithNoTacticAndTechnique = [];
    createScoreJson() {
        let heatMapList = [];
        let finalHeatMapList = [];
        let minScoreValue: any = 0;
        let maxScoreValue: any = 0;
        this.useCasesJson.usecaseData.forEach((usecase) => {
            usecase.mapping.forEach((map) => {
                map.technique.forEach((technique) => {
                    let changedName = map.tactic.toLowerCase().split(" ").join("-");
                    map.tactic = changedName;
                    let obj = technique.techniqueId + "^" + map.tactic
                    heatMapList.push(obj);
                });
            });
        });
        console.log(heatMapList);
        let counts = {};
        heatMapList.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });
        console.log(counts)
        for (const [key, value] of Object.entries(counts)) {
            if (value > 0 && value < minScoreValue) { minScoreValue = value };
            if (value > maxScoreValue) { maxScoreValue = value };
            const [techinqueID, tactic] = key.split("^");
            let obj = {
                techniqueID: techinqueID,
                tactic: tactic,
                score: value,
                color: "",
                comment: "",
                enabled: true,
                metadata: [],
                showSubtechniques: false,
            }
            finalHeatMapList.push(obj)
        }
        this.jsonTemplate.techniques = finalHeatMapList;
        this.jsonTemplate.gradient.minValue = minScoreValue;
        this.jsonTemplate.gradient.maxValue = maxScoreValue;
        console.log("JSON TEMPLATE", this.jsonTemplate.techniques);
    }
    scoringLogic() {

    }
    getTechniqueFromSet(techniue: string, tactic: string) {
        let key = techniue + "^" + tactic;
        return this.techniqueToTacticSet.get(key).attackID;
    }
    createMapsForTechniques() {
        this.techniqueToTacticSet = new Map<string, any>();
        this.domainTechniquesList.forEach((technique: any) => {
            technique.tactics.forEach(tactic => {
                let key = technique.name + "^" + tactic;
                this.techniqueToTacticSet.set(key, technique);
            });
        });
        console.log(this.techniqueToTacticSet);
        this.createScoreJson();
    }
}
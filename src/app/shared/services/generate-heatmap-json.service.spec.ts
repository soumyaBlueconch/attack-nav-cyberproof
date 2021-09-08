import { TestBed } from '@angular/core/testing';

import { GenerateHeatmapJsonService } from './generate-heatmap-json.service';

describe('GenerateHeatmapJsonService', () => {
  let service: GenerateHeatmapJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateHeatmapJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

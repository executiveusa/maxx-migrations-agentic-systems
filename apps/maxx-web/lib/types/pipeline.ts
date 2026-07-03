export interface PipelineStage {
  id: string;
  pipelineId: string;
  name: string;
  order: number;
}

export interface Pipeline {
  id: string;
  organizationId: string;
  name: string;
  stages: PipelineStage[];
}

export interface Opportunity {
  id: string;
  organizationId: string;
  pipelineId: string;
  stageId: string;
  contactId: string;
  contactName: string;
  title: string;
  value: number;
  currency: "USD";
  createdAt: string;
  updatedAt: string;
}

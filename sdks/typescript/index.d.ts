export declare const VERSION: string;

export declare const CE_SPECVERSION: "1.0";
export declare const AIGP_TYPE_PREFIX: "org.aigp.v1.";
export declare const AIGP_SOURCE_SCHEME: "aigp://";
export declare const AIGP_DATA_SCHEMA: "https://open-aigp.org/schema/aigp-event.schema.json";

export type HashAlgorithm = "sha256" | "sha384" | "sha512";
export type HashMode = "content" | "pointer";

export interface MerkleLeaf {
  resource_type: string;
  resource_name: string;
  hash: string;
  hash_mode?: HashMode;
  content_ref?: string;
}

export interface MerkleProofStep {
  sibling_hash: string;
  sibling_position: "left" | "right";
}

export interface MerkleInclusionProof {
  leaf_hash: string;
  proof_path: MerkleProofStep[];
}

export interface GovernanceMerkleTree {
  algorithm: "sha256";
  resource_count: number;
  resources: MerkleLeaf[];
  inclusion_proofs?: MerkleInclusionProof[];
}

export interface ComputeMerkleOptions {
  include_inclusion_proofs?: boolean;
  includeInclusionProofs?: boolean;
}

export type ResourceTuple = [string, string, string];

export interface ResourceObject {
  resource_type?: string;
  resourceType?: string;
  resource_name?: string;
  resourceName?: string;
  content?: string;
  hash_mode?: HashMode;
  hashMode?: HashMode;
  content_ref?: string;
  contentRef?: string;
}

export type MerkleResource = ResourceTuple | ResourceObject;

export interface CreateAIGPEventOptions {
  event_type?: string;
  event_category?: string;
  agent_id?: string;
  trace_id?: string;
  governance_hash?: string;
  span_id?: string;
  parent_span_id?: string;
  trace_flags?: string;
  agent_name?: string;
  org_id?: string;
  org_name?: string;
  hash_type?: string;
  aigp_hash?: string;
  parent_hash?: string;
  data_classification?: string;
  denial_reason?: string;
  violation_type?: string;
  severity?: string;
  request_method?: string;
  request_path?: string;
  annotations?: Record<string, unknown>;
  event_signature?: string;
  signature_key_id?: string;
  sequence_number?: number;
  causality_ref?: string;
  spec_version?: string;
  source?: string;
  governance_merkle_tree?: GovernanceMerkleTree | null;
  policy_ids?: string[];
  policy_names?: string[];
  prompt_ids?: string[];
  prompt_names?: string[];
  tool_ids?: string[];
  tool_names?: string[];
  context_ids?: string[];
  context_names?: string[];
  guardrail_ids?: string[];
  guardrail_names?: string[];
  content?: string;

  eventType?: string;
  eventCategory?: string;
  agentId?: string;
  traceId?: string;
  governanceHash?: string;
  spanId?: string;
  parentSpanId?: string;
  traceFlags?: string;
  agentName?: string;
  orgId?: string;
  orgName?: string;
  hashType?: string;
  aigpHash?: string;
  parentHash?: string;
  dataClassification?: string;
  denialReason?: string;
  violationType?: string;
  requestMethod?: string;
  requestPath?: string;
  eventSignature?: string;
  signatureKeyId?: string;
  sequenceNumber?: number;
  causalityRef?: string;
  specVersion?: string;
  source?: string;
  governanceMerkleTree?: GovernanceMerkleTree | null;
  policyIds?: string[];
  policyNames?: string[];
  promptIds?: string[];
  promptNames?: string[];
  toolIds?: string[];
  toolNames?: string[];
  contextIds?: string[];
  contextNames?: string[];
  guardrailIds?: string[];
  guardrailNames?: string[];
}

export interface AIGPEvent {
  event_id: string;
  event_type: string;
  event_category: string;
  event_time: string;
  agent_id: string;
  governance_hash: string;
  trace_id: string;
  span_id: string;
  parent_span_id: string;
  trace_flags: string;
  agent_name: string;
  org_id: string;
  org_name: string;
  hash_type: string;
  aigp_hash: string;
  parent_hash: string;
  data_classification: string;
  denial_reason: string;
  violation_type: string;
  severity: string;
  request_method: string;
  request_path: string;
  annotations: Record<string, unknown>;
  event_signature: string;
  signature_key_id: string;
  sequence_number: number;
  causality_ref: string;
  spec_version: string;
  source: string;
  policy_ids: string[];
  policy_names: string[];
  prompt_ids: string[];
  prompt_names: string[];
  tool_ids: string[];
  tool_names: string[];
  context_ids: string[];
  context_names: string[];
  guardrail_ids: string[];
  guardrail_names: string[];
  governance_merkle_tree?: GovernanceMerkleTree;
}

export interface CloudEvent {
  specversion: string;
  id: string;
  type: string;
  source: string;
  datacontenttype: string;
  data: AIGPEvent;
  time?: string;
  dataschema?: string;
  subject?: string;
  aigpagentid: string;
  aigporgid?: string;
  aigpcategory?: string;
  aigpclassification?: string;
  aigpseverity?: string;
  aigphashtype?: string;
}

export declare function normalizeEventType(eventType: string): string;
export declare function normalizeEventCategory(eventCategory?: string): string;
export declare function computeGovernanceHash(content: string, algorithm?: HashAlgorithm): string;
export declare function computeLeafHash(
  resourceType: string,
  resourceName: string,
  content: string,
  options?: { hash_mode?: HashMode; hashMode?: HashMode; content_ref?: string; contentRef?: string }
): string;
export declare function computeMerkleGovernanceHash(
  resources: MerkleResource[],
  options?: ComputeMerkleOptions
): [string, GovernanceMerkleTree | null];
export declare function buildInclusionProofs(merkleTree: GovernanceMerkleTree): MerkleInclusionProof[];
export declare function verifyInclusionProof(
  rootHash: string,
  leafHash: string,
  proofPath: MerkleProofStep[]
): boolean;
export declare function createAIGPEvent(options: CreateAIGPEventOptions): AIGPEvent;
export declare function emitAIGPEvent(options: CreateAIGPEventOptions): AIGPEvent;
export declare function toAgentGPIngestEvent(aigpEvent: Record<string, unknown>): Record<string, unknown>;
export declare function validateAIGPEvent(event: AIGPEvent): string[];

export interface EventSigner {
  readonly alg: string;
  readonly key_id: string;
  sign(signingInput: Buffer | Uint8Array): Buffer | Uint8Array;
}

export declare class ES256PrivateKeySigner implements EventSigner {
  constructor(privateKeyPem: string | Buffer, keyId?: string);
  get alg(): string;
  get key_id(): string;
  sign(signingInput: Buffer | Uint8Array): Buffer;
}

export declare function signEventWithSigner(event: AIGPEvent, signer: EventSigner): AIGPEvent;

export declare class RetryPolicy {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  constructor(options?: {
    maxAttempts?: number;
    max_attempts?: number;
    baseDelayMs?: number;
    base_delay_ms?: number;
    maxDelayMs?: number;
    max_delay_ms?: number;
  });
  delayForAttempt(attempt: number): number;
}

export declare class ReliableEmitter {
  constructor(
    sender: (event: AIGPEvent) => void | Promise<void>,
    options?: {
      retryPolicy?: RetryPolicy;
      retry_policy?: RetryPolicy;
      idempotent?: boolean;
      sleep?: (ms: number) => Promise<void>;
    }
  );
  readonly pending_count: number;
  emit(event: AIGPEvent): Promise<boolean>;
  flushFailed(options?: { maxItems?: number; max_items?: number }): Promise<{ delivered: number; pending: number }>;
}

export declare function ceTypeFromEventType(eventType: string): string;
export declare function eventTypeFromCeType(ceType: string): string;
export declare function wrapAsCloudEvent(
  aigpEvent: AIGPEvent,
  options?: { include_dataschema?: boolean; includeDataschema?: boolean }
): CloudEvent;
export declare function unwrapFromCloudEvent(ce: CloudEvent): AIGPEvent;
export declare function buildCEHeaders(
  aigpEvent: AIGPEvent,
  options?: { prefix?: string }
): Record<string, string>;

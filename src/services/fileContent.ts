// Maps the capability files to their descriptions and content snippets for viewing and downloading

export const FILE_DETAILS: Record<string, { title: string; lines: number; snippet: string }> = {
  'Db.ts': {
    title: 'Persistent Realtime Document Store',
    lines: 480,
    snippet: `/**
 * The \`db\` capability — a persistent, realtime document store for this
 * artifact, shared by its viewers.
 *
 * One store per artifact: JSON documents at slash-separated paths
 * (\`collection/doc\`, nesting deeper as \`collection/doc/subcollection/doc\`),
 * surviving reloads, republishes, and sessions.
 */

type DB = {
  doc(path: string): DocumentReference;
  collection(path: string): CollectionReference;
};

interface ClaudeCapabilityMap {
  db: DB;
}`
  },
  'Files.ts': {
    title: 'Project Files Access & Download',
    lines: 185,
    snippet: `/**
 * The \`files\` capability — read the files of the Claude Code project the
 * artifact declares (\`capabilities: {files: {project: "chan_..."}}\`), with
 * the viewer's own access.
 */

declare namespace Claude {
  namespace files {
    function list(options?: ListOptions): Promise<ListResult>;
    function read(path: string, options?: ReadOptions): Promise<ReadResult>;
    function download(path: string): Promise<DownloadResult>;
    function asSampleTools(): Promise<SampleTool[]>;
  }
}`
  },
  'User.ts': {
    title: 'Viewer Identity & Directory Search',
    lines: 260,
    snippet: `/**
 * The \`user\` capability -- facts about the person viewing this page, and
 * about the people your shared state refers to.
 */

declare namespace Claude {
  namespace user {
    function isOwner(): Promise<boolean>;
    function canEdit(): Promise<boolean>;
    function me(): Promise<Viewer>;
    function profiles(ids: readonly string[] | string): Promise<Record<string, Profile>>;
    function search(query: string): Promise<Profile[]>;
  }
}`
  },
  'Artifact.ts': {
    title: 'Artifact Publish & Live Docs',
    lines: 540,
    snippet: `/**
 * The \`artifact\` capability — this artifact, and the titles of other
 * artifacts whose ids or links it holds.
 */

declare namespace Claude {
  namespace artifact {
    function publish(html: string): Promise<PublishResult>;
    function publish(files: Record<string, PublishFile | null>): Promise<PublishResult>;
    function edit(ops: EditOp[]): Promise<EditResult>;
    function sync(fn: () => unknown): Promise<void>;
  }
}`
  },
  'Sample.ts': {
    title: 'Model Sampling & AI Completions',
    lines: 620,
    snippet: `/**
 * The \`sample\` capability — ask Claude from the published artifact, on
 * the viewer's own Claude account, and get the answer.
 */

declare namespace Claude {
  function sample(input: sample.SampleInput, options?: sample.SampleOptions): Promise<sample.SampleResult>;
  namespace sample {
    function json<T = unknown>(input: SampleInput, options?: SampleOptions): Promise<T>;
    function limits(): Promise<SampleLimits>;
  }
}`
  },
  'Comments.ts': {
    title: 'Threaded Commentary & Reviews',
    lines: 510,
    snippet: `/**
 * The \`comments\` capability — write comment threads on THIS artifact from
 * the page's own UI, as the current viewer.
 */`
  },
  'Downloads.ts': {
    title: 'Safe Client-side Downloads',
    lines: 110,
    snippet: `/**
 * The \`downloads\` capability — trigger safe client-side file saves.
 */`
  },
  'Mcp.ts': {
    title: 'Model Context Protocol Connectors',
    lines: 590,
    snippet: `/**
 * The \`mcp\` capability — connect to remote MCP servers for tools & resources.
 */`
  },
  'room.ts': {
    title: 'Ephemeral Multi-viewer Presence',
    lines: 470,
    snippet: `/**
 * The \`room\` capability — realtime ephemeral presence and messaging.
 */`
  },
  'Self.ts': {
    title: 'Legacy Artifact Capability Alias',
    lines: 20,
    snippet: `/**
 * \`self\` is the FORMER NAME of the \`artifact\` capability.
 */
interface ClaudeCapabilityMap {
  self: typeof Claude.artifact;
}`
  }
};

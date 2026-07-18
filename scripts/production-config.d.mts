export function parseProductionOrigin(value: string | undefined, name: string): URL

export function assertProductionPublishableKey(
  value: string | undefined,
  name: string,
): string

export function assertExpectedReleaseCommit(
  expectedValue: string | undefined,
  actualValue: string | undefined,
): string

export function readPublicProductionConfig(env?: NodeJS.ProcessEnv): {
  siteUrl: URL
  supabaseUrl: URL
  publishableKey: string
}

export function readProductionDatabaseConfig(env?: NodeJS.ProcessEnv): {
  projectRef: string
  supabaseUrl: URL
  publishableKey: string
}

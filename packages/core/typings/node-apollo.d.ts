declare module 'node-apollo' {
	export function createEnvFile(envConfig: any): void

	export function remoteConfigService(config: any): any

	export function remoteConfigServiceFromCache(config: any): any

	export function remoteConfigServiceSikpCache(config: any): any

	export function remoteConfigServiceSkipCache(config: any): any

	export function setEnv(): void
}

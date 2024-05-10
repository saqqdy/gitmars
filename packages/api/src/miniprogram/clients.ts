import { get } from '../request/miniprogram'

const URL_PREFIX = '/api/component/clients'

export interface GetClientsConfig {
	appID: string
	extJson: string
	config: string
	createTime: string
	updateTime: string
	id: string
}
/**
 * get clients config by appID
 *
 * @param appID - miniprogram appID
 * @returns data
 */
export async function getClientsConfig(appID: string) {
	return get<GetClientsConfig>({
		url: `${URL_PREFIX}/configuration/getConfig`,
		data: {
			appID
		}
	})
}

export default {
	getClientsConfig
}

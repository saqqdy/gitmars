export interface FetchDataType {
	level: 1 | 2 | 3 | 4 // 1=Super Admin 2=Admin 3=Reviewer 4=Developer
	[prop: string]: any
}

export interface WeiXinComponentCommonResult {
	errcode: number
	errmsg: string
}

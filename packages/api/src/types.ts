export interface FetchDataType {
	level: 1 | 2 | 3 | 4 // 1=超级管理员 2=管理员 3=审核员 4=开发者
	[prop: string]: any
}

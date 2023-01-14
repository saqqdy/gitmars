// declare let global: NodeJS.Global
// declare let module: any
// declare let exports: any

// declare namespace NodeJS {
//     export interface Global {
//         gitmarsCmdConfig: any
//     }
// }

// declare let window: any

declare global {
	const global: {
		gitmarsCmdConfig: any
	}
	const window: any
}

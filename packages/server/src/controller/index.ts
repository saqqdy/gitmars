import { join } from 'path'
import type { Request, Response } from 'express'
// import config from '#lib/config'
import staticAssets from '#lib/helper/static-assets'

export function index(path: string) {
	if (!path) path = join(process.cwd(), 'dist')
	return [
		staticAssets(path),
		(req: Request, res: Response) => {
			res.setHeader('Cache-Control', 'no-cache')
			// res.render(join(config.path.public, path, 'index.html'))
			res.render(join(path, 'index.html'))
		}
	]
}

export { index as default }

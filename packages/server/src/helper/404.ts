import type { Request, Response } from 'express'

export default function (req: Request, res: Response) {
	res.render('error', {
		code: req.query.code
	})
}

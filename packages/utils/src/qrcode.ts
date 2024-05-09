import Jimp from 'jimp'
import jsQR from 'jsqr'
import * as QRCode from 'qrcode'
import lang from './lang'

const { t } = lang

/**
 * Read text content from QR code images
 *
 * @param imagePath - image path
 */
export async function readQrcode(imagePath: any): Promise<string> {
	return new Promise((resolve, reject) => {
		Jimp.read(imagePath, function (err, image) {
			if (err) {
				reject(err)
				return
			}
			// @ts-expect-error: provisional program
			const scanData = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height)

			if (scanData) {
				resolve(scanData.data)
			} else {
				reject(new Error(t('Failure to recognize the content of the QR code')))
			}
		})
	})
}

/**
 * Convert text content into QR codes for output on the console
 *
 * @param content - qrcode content
 */
export async function printQrcode(content: string) {
	const terminalStr = await QRCode.toString(content, { type: 'terminal', small: true })
	console.info(terminalStr)
}

/**
 * Generate QR code image to specified directory
 *
 * @param path - image path
 * @param content - qrcode content
 */
export async function generateQrcodeImage(path: string, content: string) {
	await QRCode.toFile(path, content, {
		errorCorrectionLevel: 'L',
		type: 'png'
	})
}

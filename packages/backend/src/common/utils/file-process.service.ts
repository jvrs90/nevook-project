import { ImageTypes } from '@Common/enums/image-types.enum';
import { Injectable, Logger } from '@nestjs/common';
import { promises } from 'fs';
import { basename, extname } from 'path';
import * as sharp from 'sharp';

/**
 * File transformation service
 */
@Injectable()
export class FileProcessService {
	/**
	 * Image filesize result
	 */
	private resultSizeW = 330;
	private resultSizeH = 500;

	/**
	 * String format bytes to readable string
	 *
	 * @param  {number} bytes
	 * @returns string
	 */
	private bytesToSize(bytes: number): string {
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes === 0) return 'n/a';
		const i = parseInt(
			Math.floor(Math.log(bytes) / Math.log(1024)).toString(),
			10
		);
		if (i === 0) return `${bytes} ${sizes[i]})`;
		return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
	}

	/**
	 * Unknow imagetype transformation
	 *
	 * @param  {string} pathName
	 * @returns Promise
	 */
	async transformImage(
		pathName: string,
		width: number = this.resultSizeW,
		height: number = this.resultSizeH
	): Promise<sharp.OutputInfo | null> {
		const ext = extname(pathName.toLocaleLowerCase()).substring(1);
		switch (ext) {
			case ImageTypes.PNG:
				return this.transformPng(pathName, width, height);
			case ImageTypes.JPEG:
			case ImageTypes.JPG:
				return this.transformJpg(pathName, width, height);
			default: {
				Logger.error('Unkown Image Type');
				return null;
			}
		}
	}
	/**
	 * PNG tranformation method
	 *
	 * @param  {string} pathName
	 * @returns Promise
	 */
	private async transformPng(
		pathName: string,
		width: number = this.resultSizeW,
		height: number = this.resultSizeH
	): Promise<sharp.OutputInfo> {
		const file = await promises.readFile(pathName);
		return await sharp(file)
			.resize({
				height,
				width,
				fit: 'fill'
			})
			.png({
				adaptiveFiltering: true,
				quality: 75,
				progressive: true,
				compressionLevel: 5,
			})
			.toFile(pathName)
			.then(data => {
				Logger.log(`Image: ${pathName} converted`);
				return data;
			});
	}

	/**
	 * JPG & JPEG transformation method
	 *
	 * @param  {string} pathName
	 * @returns Promise
	 */
	private async transformJpg(
		pathName: string,
		width: number = this.resultSizeW,
		height: number = this.resultSizeH
	): Promise<sharp.OutputInfo> {
		const file = await promises.readFile(pathName);
		return await sharp(file)
			.resize({
				height,
				width,
				fit: 'fill'
			})
			.jpeg({
				quality: 75,
				progressive: true,
			})
			.toFile(pathName)
			.then(data => {
				Logger.log(
					`Image: ${basename(
						pathName
					)} converted successfull with size: ${this.bytesToSize(data.size)}`
				);
				return data;
			});
	}
}

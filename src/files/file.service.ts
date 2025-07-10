import { HttpException, Injectable } from '@nestjs/common';
import { crc32 } from '@shared/utils';
import { httpOrHttpsRequest } from '@shared/utils/http-request';

@Injectable()
export class FileService {
	async download(id: string) {
		const sign_hash = crc32(`${id}:AcjZn5Eq4hvKC$3LFJ*w^g6tRrQs_W2@`);
		try {
			const url = `https://test-file.us.uz/download/${id}/content?sign=${sign_hash}`;
			const data = await httpOrHttpsRequest('GET', url);
			return data;
		} catch (err) {
			throw new HttpException(err, err.status || 500);
		}
	}
}

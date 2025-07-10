import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FileDownloadDto } from './dtos/file-download.dto';

@Controller('file')
export class FileController {
	@Inject() private readonly fileService: FileService;

	@ApiBody({
		description: 'File download',
		type: FileDownloadDto,
	})
	@Post('download')
	async download(@Body() params: FileDownloadDto) {
		const { file_id } = params;
		return await this.fileService.download(file_id);
	}
}

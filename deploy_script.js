const fs = require("fs").promises;
const path = require("path");
const AWS = require("aws-sdk");

const s3 = new AWS.S3();
const cloudfront = new AWS.CloudFront();

const myBucket = process.env.AWS_BUCKET;

const deleteAllExistingFilesInAwsBucket = async () => {
	console.log('delete existing files in bucket ', myBucket);
	const listOfObjectsInBucket = await s3
		.listObjects({
			Bucket: myBucket
		})
		.promise();
	const fileKeys = [];
	listOfObjectsInBucket.Contents.forEach(fileObject => {
		fileKeys.push({
			Key: fileObject.Key
		});
	});
	if (fileKeys.length > 0) {
		await s3
			.deleteObjects({
				Bucket: myBucket,
				Delete: {
					Objects: fileKeys
				}
			})
			.promise();
	}
	console.log('files deleted');
};

const uploadFolderToBucket = async (folder_to_upload, base_folder) => {
	const files = await fs.readdir(folder_to_upload);
	for (const file of files) {
		const stat = await fs.lstat(path.join(folder_to_upload, file));
		if (stat.isFile()) {
			await uploadFileToBucket(file, folder_to_upload, base_folder);
		} else if (stat.isDirectory()) {
			await uploadFolderToBucket(path.join(folder_to_upload, file), base_folder);
		}
	}
};

const uploadFileToBucket = async (filename, folder, base_folder) => {
	try {
		const file = await fs.readFile(path.join(folder, filename));
		const folderInBucket = folder.substring(base_folder.length);
		await s3
			.putObject({
				Bucket: myBucket,
				Key: path.join(folderInBucket, filename),
				Body: file,
				ContentType: getContentType(filename),
				CacheControl: "no-cache"
			})
			.promise().catch((err) => {
				console.log('error at uploading file to bucket', err)
			});
	} catch (err) {
		console.log('error at reading file');
		console.log(err);
	}
};

const getContentType = filename => {
	const parts = filename.split(".");
	const extension = parts[parts.length - 1];
	switch (extension) {
		case "html":
			return "text/html";
		case "js":
			return "application/javascript";
		case "ico":
			return "image/x-icon";
		case "png":
			return "image/png";
		case "jpg":
			return "image/jpeg";
		case "svg":
			return "image/svg+xml";
		case "css":
			return "text/css";
	}
};


const clearOrMakeDirectory = (directory) => {
	try {
		const files = fs.readdirSync(directory);
		files.forEach((file) => {
			fs.unlinkSync(path.join(directory, file));
		});
	} catch (e) {
		fs.mkdirSync(directory);
	}
};


const deleteAndUpload = async () => {
	await deleteAllExistingFilesInAwsBucket();
	console.log('upload existing folder to bucket');
	await uploadFolderToBucket(process.env.DIST_FOLDER, process.env.DIST_FOLDER);
	console.log('files uploaded')
};

const createInvalidationForCloudfront = async () => {
	console.log('invalidate cache on cloudfront');
	await cloudfront
		.createInvalidation({
			DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
			InvalidationBatch: {
				CallerReference: new Date().getTime().toString(),
				Paths: {
					Quantity: 1,
					Items: ["/*"]
				}
			}
		})
		.promise();
};

const uploadNewFilesAndInvalidate = async () => {
	await deleteAndUpload();
	await createInvalidationForCloudfront();
};

uploadNewFilesAndInvalidate()
	.then(success => {
		console.log("finished");
	})
	.catch(error => {
		console.log("error: ", error);
	});

import fs from 'fs'
import path from 'path'

// Function to create a directory if it doesn't exist
function createDirectory(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
}

// Function to move files to their respective folders
function moveFiles() {
	// Get all files in the current directory
	const files = fs.readdirSync('.')

	// Iterate through the files
	for (const file of files) {
		// Check if the file has a .avif extension
		if (path.extname(file).toLowerCase() === '.png') {
			// Extract the folder name and file name
			const folderName = file.includes('_')
				? file.split('_')[0]
				: file.split('.')[0]
			const fileName = path.basename(file)

			const sourcePath = path.join('.', file)
			const destinationPath = path.join('.', folderName, fileName)

			// Create the directory if it doesn't exist
			createDirectory(folderName)

			// Move the file to the respective folder
			fs.renameSync(sourcePath, destinationPath)
			console.log(`Moved ${file} to ${path.join(folderName, fileName)}`)
		}
	}
}

moveFiles()

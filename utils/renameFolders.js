import fs from 'fs'
import path from 'path'
import readline from 'readline'

// Create readline interface
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

// Function to prompt the user for input
function prompt(query) {
	return new Promise((resolve) => rl.question(query, resolve))
}

// Function to load the progress file
function loadProgress(progressFilePath) {
	if (fs.existsSync(progressFilePath)) {
		const data = fs.readFileSync(progressFilePath, 'utf8')
		return JSON.parse(data)
	}
	return []
}

// Function to save the progress file
function saveProgress(progressFilePath, data) {
	fs.writeFileSync(progressFilePath, JSON.stringify(data, null, 2), 'utf8')
}

// Function to rename folder and files
async function renameFoldersAndFiles(basePath, progressFilePath) {
	const renamedFolders = loadProgress(progressFilePath)
	const folders = fs
		.readdirSync(basePath)
		.filter((file) => fs.lstatSync(path.join(basePath, file)).isDirectory())

	for (const folder of folders) {
		if (renamedFolders.includes(folder)) {
			console.log(`Skipping already renamed folder: ${folder}`)
			continue
		}

		const newFolderName = await prompt(
			`Enter new name for folder "${folder}": `
		)
		const oldFolderPath = path.join(basePath, folder)
		const newFolderPath = path.join(basePath, newFolderName)

		// Rename the folder
		fs.renameSync(oldFolderPath, newFolderPath)

		// Rename the files inside the folder
		const files = fs.readdirSync(newFolderPath)
		files.forEach((file) => {
			const oldFilePath = path.join(newFolderPath, file)
			const newFileName = file.replace(folder, newFolderName)
			const newFilePath = path.join(newFolderPath, newFileName)
			fs.renameSync(oldFilePath, newFilePath)
		})

		console.log(
			`Renamed folder and files from "${folder}" to "${newFolderName}"`
		)

		// Add folder to the renamed list and save progress
		renamedFolders.push(newFolderName)
		saveProgress(progressFilePath, renamedFolders)
	}

	rl.close()
}

// Run the script
const basePath = '.' // Replace with the path to your folders
const progressFilePath = './renamed_folders.json' // Path to the progress file
renameFoldersAndFiles(basePath, progressFilePath)

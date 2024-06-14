import fs from 'fs'
import inquirer from 'inquirer'

const shiplistPath = 'shiplist-1.json'

// Function to capitalize the first character and each character after an underscore
function formatName(folderName) {
	return folderName
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

// Function to get images in a folder
function getImages(folder) {
	const imagesArray = fs
		.readdirSync(folder)
		.filter((file) => file.endsWith('.avif'))
		.map((file) => folder + '/' + file)

	return imagesArray
}

// Function to prompt user for ship details
async function getShipDetails(folderName) {
	console.log()
	console.log('Scanning ' + folderName)
	console.log()
	const { id, name, hull, rarity, faction } = await inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Enter ID:',
		},
		{
			type: 'input',
			name: 'name',
			message: 'Enter Name (leave blank to auto-generate):',
		},
		{
			type: 'input',
			name: 'hull',
			message: 'Enter Hull:',
			default: 'Misc',
		},
		{ type: 'input', name: 'rarity', message: 'Enter Rarity:' },
		{
			type: 'input',
			name: 'faction',
			message: 'Enter Faction:',
			default: 'Misc',
		},
	])

	let factionName

	switch (faction) {
		case 'HMS' || 'hms':
			factionName = 'Royal Navy'
			break
		case 'USS' || 'uss':
			factionName = 'Eagle Union'
			break
		case 'IJN' || 'ijn':
			factionName = 'Sakura Empire'
			break
		case 'KMS' || 'kms':
			factionName = 'Iron Blood'
			break
		case 'DE' || 'de':
			factionName = 'Dragon Empery'
			break
		case 'RN' || 'rn' || 'SE' || 'se':
			factionName = 'Sardegna Empire'
			break
		case 'SN' || 'sn':
			factionName = 'Northern Parliament'
			break
		case 'FN' || 'fn':
			factionName = 'Iris Libre'
			break
		case 'MNF' || 'mnf':
			factionName = 'Vichya Dominion'
			break
		case 'meta' || 'Meta':
			factionName = 'META'
			break
		case 'TEM' || 'tem':
			factionName = 'Tempesta'
			break
		default:
			factionName = faction
	}

	let rarityName

	switch (rarity) {
		case 'C':
			rarityName = 'Common'
			break
		case 'R':
			rarityName = 'Rare'
			break
		case 'E':
			rarityName = 'Elite'
			break
		case 'SR':
			rarityName = 'Super Rare'
			break
		case 'UR':
			rarityName = 'Ultra Rare'
			break
		default:
			rarityName = rarity
	}

	return {
		id,
		name: name || formatName(folderName),
		hull,
		rarity: rarityName,
		faction: factionName,
	}
}

async function main() {
	const folders = fs
		.readdirSync('.')
		.filter((file) => fs.statSync(file).isDirectory())
	let shiplist = []

	if (fs.existsSync(shiplistPath)) {
		shiplist = JSON.parse(fs.readFileSync(shiplistPath))
	}

	// Collect already processed folder names
	const processedFolders = new Set(
		shiplist.map((entry) => entry.images[0].split('/')[1].split('.')[0])
	)

	for (const folder of folders) {
		// Skip the folder if it has already been processed
		if (
			processedFolders.has(folder) ||
			folder === 'allen_m._sumner' ||
			folder === 'black_heart' ||
			folder === 'green_heart' ||
			folder === 'honoka_DOA' ||
			folder === 'luna_DOA' ||
			folder === 'marie_rose_DOA' ||
			folder === 'misaki_DOA' ||
			folder === 'monika_DOA' ||
			folder === 'nagisa_DOA' ||
			folder === 'nyotengu_DOA' ||
			folder === 'purple_heart' ||
			folder === 'st.louis' ||
			folder === 'specialized_bulin_custom_MKIII' ||
			folder === 'tamaki_DOA' ||
			folder === 'u-47' ||
			folder === 'white_heart'
		) {
			console.log(`Skipping already processed folder: ${folder}`)
			continue
		}

		const images = getImages(folder)

		if (images.length > 0) {
			const shipDetails = await getShipDetails(folder)

			shiplist.push({
				...shipDetails,
				images,
			})

			// Write to shiplist.json after each entry
			fs.writeFileSync(shiplistPath, JSON.stringify(shiplist, null, 2))
			console.log(`Added entry for folder: ${folder}`)
			console.log(`Total entries: ${shiplist.length}`)
		}
	}

	console.log('Shiplist updated successfully!')
}

main()

import fs from 'fs'
import inquirer from 'inquirer'

const shiplistPath = 'shiplist.json'
const shiplist = JSON.parse(fs.readFileSync(shiplistPath))

const main = async () => {
	const files = fs.readdirSync('.')
	const newShiplist = []

	for (const file of files) {
		if (!file.endsWith('.png')) {
			continue
		}

		const name = file.split('_alter.png')[0]

		const shipObject = shiplist.find(
			(ship) =>
				ship.name.toLowerCase() === name.split('_').join(' ').toLowerCase()
		)

		if (!shipObject) {
			console.log(`Ship not found: ${name}`)
			continue
		}

		const { id } = await inquirer.prompt([
			{
				type: 'input',
				name: 'id',
				message: `Enter ID for ${name}:`,
			},
		])

		const images = [`_meta/${file}`]
		const entry = {
			...shipObject,
			id,
			name: `${shipObject.name} META`,
			images,
		}

		newShiplist.push(entry)
	}

	fs.writeFileSync(
		'shiplist-1.json',
		JSON.stringify(newShiplist, null, 2),
		'utf8'
	)
}

const edit = () => {
	const shiplistPath = 'shiplist-1.json'
	const shiplist = JSON.parse(fs.readFileSync(shiplistPath))
	const editedShiplist = []

	for (const entry of shiplist) {
		const newShip = { ...entry, faction: 'META' }

		editedShiplist.push(newShip)
	}

	fs.writeFileSync(
		'shiplist-2.json',
		JSON.stringify(editedShiplist, null, 2),
		'utf8'
	)
}

main()
// edit()

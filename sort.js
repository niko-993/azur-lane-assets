import fs from 'fs'

const main = () => {
	const shiplist = JSON.parse(fs.readFileSync('shiplist.json'))

	const newShipList = shiplist.sort((a, b) => a.name.localeCompare(b.name))

	fs.writeFileSync(
		'shiplist-1.json',
		JSON.stringify(newShipList, null, 2),
		'utf8'
	)
}

main()

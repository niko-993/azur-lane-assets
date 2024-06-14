// ! RUN ONLY ONCE

import fs from 'fs'

const mainFile = 'shiplist.json'
const updateFile = 'shiplist-1.json'

const update = JSON.parse(fs.readFileSync(updateFile))
const main = JSON.parse(fs.readFileSync(mainFile))

update.forEach((entry) => {
	if (!main.some((e) => e.id === entry.id)) {
		main.push(entry)
		console.log('Pushing new entry: ', entry.name)
	} else {
		const index = main.findIndex((e) => e.id === entry.id)

		main[index]['images'] = main[index]['images'].concat(entry['images'])
		console.log('Merging entry: ', entry.name)
	}
})

fs.writeFileSync(mainFile, JSON.stringify(main, null, 2), 'utf8')

console.log('Done!')

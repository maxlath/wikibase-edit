module.exports = {
  randomString: () => Math.random().toString(36).slice(2, 10),
  randomNumber: (lenght) => Math.trunc(Math.random() * Math.pow(10, lenght)),
  // Sandbox entity: https://wikidata.org/wiki/Q4115189
  sandboxEntity: 'Q4115189',
  sandboxDescriptionFr: "Bac à sable pour amuser les contributeurs (laisser une description ici pour qu'on le retrouve)"
}

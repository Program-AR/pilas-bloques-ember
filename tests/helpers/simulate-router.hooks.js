/** 
 * Simulate the model hook from router.
 */
export default async (store) => {
    // TODO: vamos a tener que volver a correr el for del hook de application.js
    await store.findAll("libro");
    await store.findAll("capitulo");
    await store.findAll("grupo");
    await store.findAll("desafio");
}
/** 
 * Simulate the model hook from router.
 */
export default async (store) => {
    await store.findAll("libro");
    await store.findAll("capitulo");
    await store.findAll("grupo");
    await store.findAll("desafio");
}
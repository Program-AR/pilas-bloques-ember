export default async (store) => {
    /** 
     * Simulate the model hook from router.
     * 
     * TODO: replace the findAll("desafio") and findBy('nombre', nombre)
     * function by a more specific ember-data query, like findRecord which 
     * fetchs only one record.
     * 
     * (This only exist because mirage must be need fixed before).
     */

    await store.findAll("libro");
    await store.findAll("capitulo");
    await store.findAll("grupo");
    await store.findAll("desafio");
}
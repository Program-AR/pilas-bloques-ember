/*
 * Use this function if you need to wait for an action to complete.
 * Using send directly does not work because it does not return a Promise.
 * Send is void.
*/
export const asyncActionCall = async (receiver, actionName, ...args) =>
    await receiver.actions[actionName].call(receiver, ...args)
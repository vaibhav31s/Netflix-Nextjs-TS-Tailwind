import {createCheckoutSession , getStripePayments} from  '@stripe/firestore-stripe-payments';
import {getFunctions, httpsCallable} from  'firebase/functions';
import app from  '../firebase';

const payment = getStripePayments(app, {
    productsCollection : 'products',
    customersCollection : 'customers',
});
const loadCheckout = async (priceId: string)=>{
    await createCheckoutSession(payment, {
        price : priceId,
        successUrl: window.location.origin,
        cancelUrl: window.location.origin,
            }).then((snapshot)=>{
                window.location.assign(snapshot.url)
            }).catch((error)=>{ console.log(error.message)})
            ;
}
export {loadCheckout}
export default payment;
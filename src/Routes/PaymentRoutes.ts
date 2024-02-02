import Stripe from "stripe"
import { config } from "../config"
import { Router } from "express"
import { httpStatusCode } from "../Util/HttpUtils"
import { NewPremiumSubscription } from "../Models/DrizzleModels"
import { Currency } from "../Models/Backend/Currency"

const stripe = new Stripe(config.STRIPE_SECRET_KEY)

export function paymentRoutes(router: Router) {
  router.post("/premium-subscription", async (req, res) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const newPremiumSubscription = req.body.premiumSubscription as NewPremiumSubscription
      const { userId, email, currency, stripePaymentMethodId } = newPremiumSubscription

      const customer = await stripe.customers.create({
        email,
        payment_method: stripePaymentMethodId,
        invoice_settings: { default_payment_method: stripePaymentMethodId },
      })

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: currency === Currency.EUR ? config.STRIPE_PREMIUM_MEMBERSHIP_PRICE_EUR : config.STRIPE_PREMIUM_MEMBERSHIP_PRICE_USD }],
        expand: ["latest_invoice.payment_intent"],
      })

      // TODO: remove
      console.log("subscription", { subscription, userId })

      /*
      id = "sub_1Of6qGDMnBv5AFIfEdY38eXK"
      object = "subscription"
      application = null
      application_fee_percent = null
      automatic_tax = Object {enabled: false, liability: null}
      billing_cycle_anchor = 1706819196
      billing_cycle_anchor_config = null
      billing_thresholds = null
      cancel_at = null
      cancel_at_period_end = false
      canceled_at = null
      cancellation_details = Object {comment: null, feedback: null, reason: null}
      collection_method = "charge_automatically"
      created = 1706819196
      currency = "eur"
      current_period_end = 1709324796
      current_period_start = 1706819196
      customer = "cus_PU50kq171NXiqc"
      days_until_due = null
      default_payment_method = null
      default_source = null
      default_tax_rates = Array(0) []
      description = null
      discount = null
      ended_at = null
      invoice_settings = Object {account_tax_ids: null, issuer: Object}
      items = Object {object: "list", data: Array(1), has_more: false, total_count: 1, url: "/v1/subscription_items?subscription=sub_1Of6qGDMnBv5AFIfEdY38eXK"}
      latest_invoice = Object {id: "in_1Of6qGDMnBv5AFIf4mCtTnzJ", object: "invoice", account_country: "SE", account_name: "8b Services AB", account_tax_ids: null, ...}
      livemode = false
      metadata = Object {}
      next_pending_invoice_item_invoice = null
      on_behalf_of = null
      pause_collection = null
      payment_settings = Object {payment_method_options: null, payment_method_types: null, save_default_payment_method: "off"}
      pending_invoice_item_interval = null
      pending_setup_intent = null
      pending_update = null
      plan = Object {id: "price_1Of207DMnBv5AFIfLdthmzrM", object: "plan", active: true, aggregate_usage: null, amount: 999, ...}
      quantity = 1
      schedule = null
      start_date = 1706819196
      status = "active"
      test_clock = null
      transfer_data = null
      trial_end = null
      trial_settings = Object {end_behavior: Object}
      trial_start = null
      lastResponse = IncomingMessage {_readableState: ReadableState, _events: Object, _eventsCount: 2, _maxListeners: undefined, socket: null, ...}
      [[Prototype]] = Object */

      // TODO: store subscription in DB

      res.sendStatus(httpStatusCode.OK)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })
}

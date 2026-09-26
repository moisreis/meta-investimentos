import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import { APPLICATION_FORM_SCHEMA } from "./application-form.validations"

// The payload accepted by the add application action. The
// form and the action share the application schema, so the
// client check and the server check can never drift apart.
// The portfolio id is added here because it identifies the
// target portfolio and is supplied by the screen that opens
// the dialog, not by the form fields.
//
// The quotas are absent on purpose: they are always derived
// from the quota price of the chosen date by the service
// layer, and the amount is the only money value the client
// is allowed to send.
const ADD_APPLICATION_SCHEMA = APPLICATION_FORM_SCHEMA.extend({
  portfolioId: ID_SCHEMA,
})

// Values of the add application action payload.
type AddApplicationValues = z.infer<
  typeof ADD_APPLICATION_SCHEMA
>

export { ADD_APPLICATION_SCHEMA, type AddApplicationValues }

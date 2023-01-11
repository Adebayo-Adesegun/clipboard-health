# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Note (My thoughts)

The main take away from this is being able to create a custom Id for an Agent that will replace the auto generated sequenced internal database Id used on the generated reports, which will mean that a new field that holds a unique Id for an Agent. My assumption would be that an Agent can only work in one facility at a time so this makes it easier to add a custom_id field to the Agent model.
Having added the customId to the Agent model, we need to run migration and create the UI's that ensure that the Facilities can input the custom Id and then alter the workflow for the report generation to pick the customId for the report or fallback to the internal database id where it is not set.

### Ticket 1

Add `facility_custom_id` field to the Agent model in the database and create function to map `facility_custom_id` to agent for a facility.

Acceptance Criteria:

- `facility_custom_id` field ia added to the Agent model, the `facility_custom_id` should allow null values since it's an optional field and should be an alphanumeric type.

- A migration file should have been generated for the newly added field.

- Created a function that can be called with the `facility_custom_id`and the `Agent Id` as parameters which would update the Agent Model with the record.

- Added a validator check which would be a private function that ensures that the generated `facility_custom_id` is unique.

- Added test cases to test the uniqueness of `facility_custom_id`'s generated.

Time/Effort Estimate:

- This should take 45 mins to update the existing documentation for the models, and database design
- 30 mins to create the function to update the Agent with their `facility_custom_id`
- 30 mins to create the function to ensure `facility_custom_id`'s uniqueness
- 3 hours to test the migration and ensure that the migration is propagated correctly to all environments.

### Ticket 2

Update the code that handles the report generation for facilities to use the `facility_custom_id` field.

Acceptance Criteria:

- Use the `facility_custom_id` on the report generation if provided
- Refactor the report generation function to use a null check for `facility_custom_id` ensuring that it fallbacks to the internal generated id for agents where the `facility_custom_id` has not been created for an agent.
- Add test cases

Time/Effort :

- This should take 3 hours for code update and 1 hours 30 mins for the tests

### Ticket 3

Create a Form in the Facility's module where a facility can add the `facility_custom_id` to an Agent

Acceptance Criteria:

- A form is created in the Facility's Module that allows `facility_custom_id` to be mapped to each Agent assigned to the faility.

- The submission of the form calls the custom function that maps agent to their corresponding `facility_custom_id` and then to database.

- The form allows a facility to edit and also view custom ids that already exists.

- Added test cases

Time/Effort:

- This should take 5 Hours for UI design and Implemenation and 2 hours for testing

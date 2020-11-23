# goUpdateNetSuite AWS Lambda 2 of 3

Consume AWS SQS messages. mk NetSuite Work Order Completions via [Restlet](https://github.com/Shaun-York/NetSuiteWOCompletionsRestlet) pass to next sqs queue

AWSAPI Gateway -> SQS -> [updateTaskQty](https://github.com/Shaun-York/updateTaskQty) -> SQS -> [updateNetSuite](https://github.com/Shaun-York/updateNetSuite) -> SQS -> [updateCompletion](https://github.com/Shaun-York/updateCompletion)

## Payload - Completion table columns

```json
{
    "workordercompletion_id": "to be filled workorder completion internailid",
    "operation_sequence": "NetSuite operation sequence",
    "last_completion": "boolean this completion completes build",
    "remaining_qty": "input qty - completed",
    "mfgoptask_id": "NetSuite mfg operation task internalid",
    "completedQty": "Qty completed",
    "workorder_id": "NetSuite workorder internalid",
    "operator_id": "Operators",
    "worktime_id": "Worktime table pk",
    "location_id": "Location completed at internalid",
    "machine_id": "Machine completed on pk",
    "updated_at": "updated at",
    "created_at": "created at",
    "workcenter": "NetSuite entity group",
    "scrapQty": "Qty scrapped in completion",
    "item_id": "NetSuite item internalid",
    "action": "mk or rm",
    "id": "table pk",
}
```

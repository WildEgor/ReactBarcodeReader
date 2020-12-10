let schema = {
    title: "Forma",
    type: "object",
    required: [
      "articul",
      "desc",
      "countAll",
      "sold",
      "remind",
      "notes"
    ],
    properties: {
      articul: {
        type: "string",
        title: "Артикул",
        minLength: 3,
        maxLength: 255
      },
      desc: {
        type: "string",
        title: "Краткое описание",
        minLength: 3,
        maxLength: 255
      },
      countAll: {
        type: "number",
        title: "Всего на складе",
        minimum: 0,
        maximum: 120,
        step: 1
      },
      sold: {
        type: "number",
        title: "Продано",
        minimum: 0,
        maximum: 120
      },
      remind: {
        type: "number",
        title: "Остаток",
        minimum: 0,
        maximum: 120
      },
      notes: {
        type: "string",
        title: "Примечание",
        minLength: 3,
        maxLength: 255
      }
    }
  }; 

  let uiSchema = {
    articul: {
      "ui:autofocus": true,
      "ui:help": "Партийный номер"
    },
    countAll: {
        "ui: widget": "updown",
    },
    remind: {
      "ui:disabled": "true"
    },
    desc:{
        "ui:widget": "textarea",
        "ui:help": "Категория товара, описание товара и пр."
    },
    notes:{
        "ui:widget": "textarea",
        "ui:help": "Введите номер штрихкода"
    },
  }

export {
    schema,
    uiSchema
}
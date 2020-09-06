import Component from '@ember/component'
import Survey from 'survey-knockout'

export default Component.extend({
  /** Dialog descriptions according to SurveyJS library.
   ** Additional field: askEachSession, which tells the app to ask the question each time*/
  surveyDialogs: [ 
    { title:  "Edad y Género",
      pages: [{ name:"ageAndGender", questions: [ 
            { type: "dropdown", choices: [ 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17, "18 o más" ], isRequired: true, name: "age", title: "¿Cuántos años tenés?" },
            { type: "radiogroup", choices: ["Mujer", "Varón", "Otro"], isRequired: true, name: "gender", title: "¿Cuál es tu género?", visibleIf: "{age} != undefined" }
          ]
        }]
    },
    { title:  "Escuela y Provincia", 
      pages: [{ name:"schoolAndProvince", questions: [ 
            { type: "dropdown", choices: ['Ciudad Autónoma de Buenos Aires (CABA)', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego, Antártida e Islas del Atlántico Sur', 'Tucumán', 'No estoy en Argentina'], isRequired: true, name: "province", title: "¿En qué provincia vivís?" },
            { type: "radiogroup", choices: ["Pública", "Parroquial", "Privada"], isRequired: true, name: "gender", title: "¿A qué tipo de escuela vas?", visibleIf: "{province} != undefined" }
          ]
        }]
    },
    { title:  "Clase o Tarea",
      pages: [{ name:"classOrHomework", questions: [ 
            { type: "radiogroup", choices: ["Sí", "No"], isRequired: true, name: "isOnSchoolTime", title: "¿Estás en horario escolar?" },
            { type: "radiogroup", choices: ["Sí", "No"], isRequired: true, name: "isDoingHomework", title: "¿Estás haciendo la tarea?", visibleIf: "{isOnSchoolTime} != undefined" }
          ]
        }],
      askEachSession: true
    },
    { title:  "Escuela y Compañía",
      pages: [{ name:"schoolAndCompany", questions: [ 
            { type: "radiogroup", choices: ["Sí", "No"], isRequired: true, name: "isAtSchool", title: "¿Estás físicamente en la escuela?" },
            { type: "text", isRequired: true, name: "avatar", title: "¿Cómo es tu apodo?", visibleIf: "{isAtSchool} = 'Sí'" }
          ]
        }],
      askEachSession: true
    }
  ],

  didInsertElement() {
    this.showNextDialog()
  },

  showSurveyDialog(surveyDialog) {
    var surveyWindow = new Survey.SurveyWindow(surveyDialog)
    surveyWindow.isExpanded = true
    surveyWindow.survey.locale = 'es'
    surveyWindow.show()
    surveyWindow.survey.onComplete.add(sur =>{ console.log(sur.data); this.incrementDialogIndex() }) // TODO: replace by call to backend
  },

  showNextDialog() {
    var nextDialog = this.surveyDialogs[this.nextDialogIndex()]
    if (nextDialog) this.showSurveyDialog(nextDialog)
  },

  nextDialogIndex() {
    if(localStorage.getItem('nextDialogIndex') === null || localStorage.getItem('nextDialogIndex') === undefined){
      localStorage.setItem('nextDialogIndex','0')
    }
    return parseInt(localStorage.getItem('nextDialogIndex'))
  },

  incrementDialogIndex(){
    localStorage.setItem('nextDialogIndex',this.nextDialogIndex() + 1)
  }
});

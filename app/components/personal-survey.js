import Component from '@ember/component'
import Survey from 'survey-knockout'

export default Component.extend({
  /** Dialog descriptions according to SurveyJS library.
   ** Additional field: askEachSession, which tells the app to ask the question each time*/
  surveyDialogs: [ 
    {
      title: "¿Nos ayudás?",
      logo: "imagenes/surveyLogoCoty.png",
      pages: [{ name: "askingHelp", questions: [
        { type: "html", name: "askingHelp", html: "<p>¡Hola! ¿Nos ayudás a mejorar Pilas Bloques?</p><p>Te vamos a hacer preguntas cortitas.</p><p>¡Contestalas cuando quieras!</p>" }
      ]}]
    },
    { title: "Edad y Género",
      logo: "imagenes/surveyLogoLita.png",
      pages: [{ name:"ageAndGender", questions: [ 
            { type: "dropdown", choices: [ 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17, "18 o más" ], isRequired: true, name: "age", title: "¿Cuántos años tenés?" },
            { type: "radiogroup", choices: ["Mujer", "Varón", "No binario", "Prefiero no responder"], isRequired: true, name: "gender", title: "¿Cuál es tu género?", visibleIf: "{age} != undefined" }
          ]
        }]
    },
    { title:  "Escuela y Provincia", 
      logo: "imagenes/surveyLogoAlien.png",
      pages: [{ name:"schoolAndProvince", questions: [ 
            { type: "dropdown", choices: ['No estoy en Argentina', 'Ciudad Autónoma de Buenos Aires (CABA)', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego, Antártida e Islas del Atlántico Sur', 'Tucumán'], isRequired: true, name: "province", title: "¿En qué provincia vivís?" },
            { type: "radiogroup", choices: ["Pública", "Parroquial", "Privada"], isRequired: true, name: "gender", title: "¿A qué tipo de escuela vas?", visibleIf: "{province} != undefined" }
          ]
        }]
    },
    { title:  "Clase o Tarea",
      logo: "imagenes/surveyLogoHeroin.png",
      pages: [{ name:"classOrHomework", questions: [ 
            { type: "radiogroup", choices: ["Sí", "No"], isRequired: true, name: "isOnSchoolTime", title: "¿Estás en horario escolar?" },
            { type: "radiogroup", choices: ["Sí, estoy haciendo la tarea", "No"], isRequired: true, name: "isDoingHomework", title: "¿Estás haciendo la tarea?", visibleIf: "{isOnSchoolTime} = 'No'" }
          ]
        }],
      askEachSession: true
    },
    { title:  "Escuela y Compañía",
      logo: "imagenes/surveyLogoCoty.png",
      pages: [{ name:"schoolAndCompany", questions: [ 
            { type: "radiogroup", choices: ["Sí", "No"], isRequired: true, name: "isAtSchool", title: "¿Estás físicamente en la escuela?" },
            { type: "text", isRequired: true, name: "nickname", title: "¿Cómo es tu apodo?", visibleIf: "{isAtSchool} = 'Sí'" },
            { type: "radiogroup", choices: ["Estoy con una adulta o adulto", "Estoy con una compañera o compañero", "No me está ayudando nadie"], isRequired: true, name: "help", title: "¿Te está ayudando alguien?", visibleIf: "{isAtSchool} = 'No'"}
          ]
        }],
      askEachSession: true
    }
  ],

  didInsertElement() {
    this.showNextDialog()
  },

  showSurveyDialog(surveyDialog) {
    if (window.surveyWindow) return; // don't create other surveyWindow if it exists.
    Survey.StylesManager.applyTheme("winterstone")
    window.surveyWindow = new Survey.SurveyWindow(surveyDialog)
    window.surveyWindow.isExpanded = true
    window.surveyWindow.survey.locale = 'es'
    window.surveyWindow.survey.showQuestionNumbers = 'off'
    window.surveyWindow.survey.logoHeight = 75
    window.surveyWindow.survey.logoWidth = 75
    window.surveyWindow.survey.logoPosition = 'top'
    window.surveyWindow.show()
    window.surveyWindow.survey.onComplete.add(survey => this.saveDialogAnswer(survey.data))
  },

  showNextDialog() {
    if (this.nextDialog()) this.showSurveyDialog(this.nextDialog())
  },

  saveDialogAnswer(data){
    console.log(data); // TODO: replace by call to backend
    this.markCurrentDialogAsAnswered() 
  },

  markCurrentDialogAsAnswered(){
    let storage = this.nextDialog().askEachSession ? sessionStorage : localStorage
    storage.setItem('titlesAnswered',JSON.stringify(this.titlesAnswered(storage).concat([this.nextDialog().title])))
    window.surveyWindow = undefined
  },

  nextDialog() { return this.surveyDialogs.find(surveyDialog => !this.wasAnswered(localStorage, surveyDialog) && !this.wasAnswered(sessionStorage, surveyDialog)) },
  wasAnswered(storage, surveyDialog) { return this.titlesAnswered(storage).includes(surveyDialog.title)},

  titlesAnswered(storage) {
    let titlesAnswered = []
    try { 
       titlesAnswered = JSON.parse(storage.getItem('titlesAnswered')) || []
    } catch(e) {
      // if parse fails, leave it []
    }
    return titlesAnswered
  }

});

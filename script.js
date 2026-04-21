class Question{
    constructor(answer){
        this.answer = answer
        
    }
    
}

class Subject{
    constructor(questions, type){
        this.questions = questions
        this.type = type
    }

    newQuestion(){
        this.display(this.questions[Math.trunc(Math.random()*this.questions.length)])
    }

    display(question){

    }

}
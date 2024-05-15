class kursBlad {
    constructor(setup) {
        this.data = {}

    }

    init() {
        this.data["courses"] = this.load()
    }

    load(setup) {

        let apiUrl = 'https://api.skolverket.se/syllabus/v1/subjects?schooltype=GY&timespan=FUTURE&typeOfSyllabus=GRADE_SUBJECT_SYLLABUS';
        let courseList = []

        fetch(apiUrl)
        .then(response => { return response.json() })
        .then(fetchedSubjects =>{
            for (let subject of fetchedSubjects["subjects"]) {
                
                fetch('https://api.skolverket.se/syllabus/v1/subjects/'+ subject["code"] +'?date=2025-07-01')
                .then(response => { return response.json() })
                .then(fetchedSubject => {
                    for (let fetchedCourse of fetchedSubject["subject"]["courses"]) {
                        let course = {
                            "subject_name": fetchedSubject["subject"]["name"],
                            "subject_code": fetchedSubject["subject"]["code"],
                            "course_name": fetchedCourse["name"],
                            "course_code": fetchedCourse["code"],
                            "course_content": fetchedCourse["centralContent"]["text"]
                        }
                        courseList.push(course)
                    }
                })
                
            }
        })
        return courseList
    }
}
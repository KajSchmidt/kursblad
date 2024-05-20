class courseSelect {
    constructor(setup) {
        this.data = {}

        this.layout = {}
        this.layout["program_name"] = document.querySelector("#program_name")
        this.layout["g_common"] = document.querySelector("#g_common")
        this.layout["p_common"] = document.querySelector("#p_common")
        this.layout["s_common"] = document.querySelector("#s_common")
        this.layout["e_courses"] = document.querySelector(".e_courses__container")

    }

    init() {
    }

    fetchCourses(setup) {

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

    loadCourses(setup, data) {
        this.data["courses"] = data
    }

    loadPrograms(setup, data) {
        this.data["programs"] = data
    }

    getCourse(course_code) {
        let course = this.data["courses"].find(c => c["course_code"] == course_code)
        return course
    }
    
    layoutFillProgram(program_code) {
        let program = this.data["programs"].find(p => p["program_code"] == program_code)
        this.layout["program_name"].innerText = program["program_name"]

        for (let course_code of program["g_common_courses"]) {
            let course = this.getCourse(course_code)
            this.layout["g_common"].append(this.buildCourseCard(course))
        }

        for (let course_code of program["p_common_courses"]) {
            let course = this.getCourse(course_code)
            this.layout["p_common"].append(this.buildCourseCard(course))
        }

        for (let course_code of program["s_common_courses"]) {
            let course = this.getCourse(course_code)
            this.layout["s_common"].append(this.buildCourseCard(course))
        }

        for (let course_code of program["electable_courses"]) {
            let course = this.getCourse(course_code)
            this.layout["e_courses"].append(this.buildCourseCard(course))
        }
    }

    buildCourseCard(course) {
        let courseCard = document.createElement("div")
        courseCard.classList.add("course__card")

        let courseCardHeader = document.createElement("span")
        courseCardHeader.classList.add("course__cardheader")
        courseCardHeader.innerText= course["subject_name"]

        let courseCardFooter = document.createElement("span")
        courseCardFooter.classList.add("course__cardfooter")
        courseCardFooter.innerText= course["course_name"]
        
        courseCard.append(courseCardHeader)
        courseCard.append(courseCardFooter)

        return courseCard
    }
}
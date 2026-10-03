import ManagementModulePage from "./ManagementModulePage";

function ManagementCourseRegistrations() {
    return (
        <ManagementModulePage
            title="Course Registrations"
            description="View student course registration and enrollment information."
            endpoint="/course-registrations"
        />
    );
}

export default ManagementCourseRegistrations;
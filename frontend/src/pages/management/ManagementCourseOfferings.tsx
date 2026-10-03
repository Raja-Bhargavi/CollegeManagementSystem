import ManagementModulePage from "./ManagementModulePage";

function ManagementCourseOfferings() {
    return (
        <ManagementModulePage
            title="Course Offerings"
            description="View course offerings, academic terms, and teaching assignments."
            endpoint="/course-offerings"
        />
    );
}

export default ManagementCourseOfferings;
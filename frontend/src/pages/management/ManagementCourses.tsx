import ManagementModulePage from "./ManagementModulePage";

function ManagementCourses() {
    return (
        <ManagementModulePage
            title="Courses"
            description="View courses offered by the institution and their academic information."
            endpoint="/courses"
        />
    );
}

export default ManagementCourses;
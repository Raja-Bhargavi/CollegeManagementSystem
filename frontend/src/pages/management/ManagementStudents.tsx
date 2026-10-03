import ManagementModulePage from "./ManagementModulePage";

function ManagementStudents() {
    return (
        <ManagementModulePage
            title="Students"
            description="View student information and institutional academic records."
            endpoint="/students"
        />
    );
}

export default ManagementStudents;
import ManagementModulePage from "./ManagementModulePage";

function ManagementMarks() {
    return (
        <ManagementModulePage
            title="Marks"
            description="View examination marks and academic assessment records."
            endpoint="/marks"
        />
    );
}

export default ManagementMarks;
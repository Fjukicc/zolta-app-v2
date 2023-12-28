// employee worktime
export const getEmployeeWorktime = async (employee_id) => {
  try {
    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/admin/worktime",
      {
        method: "POST",
        body: JSON.stringify({
          admin_id: employee_id,
        }),
      }
    );

    if (!data.ok) {
      throw new Error("Failed to fetch employee worktime");
    }
    const employee_worktime = await data.json();

    return {
      success: true,
      data: employee_worktime,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch employee worktime",
    };
  }
};

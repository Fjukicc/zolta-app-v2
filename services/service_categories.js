//addd service category
export const addServiceCategory = async (service_category_to_add) => {
  try {
    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service_category",
      {
        method: "PUT",
        body: JSON.stringify(service_category_to_add),
      }
    );

    if (!data.ok) {
      throw new Error("Nemožemo Dodati Kategoriju Servisa");
    }

    const new_service_category = await data.json();

    if (new_service_category.result === false) {
      throw new Error(new_service_category.err_log);
    }

    return {
      success: true,
      data: new_service_category,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: error };
  }
};

export const deleteServiceCategory = async (service_category_id) => {
  try {
    var reqBody = {
      id: service_category_id,
    };

    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service_category",
      {
        method: "DELETE",
        body: JSON.stringify(reqBody),
      }
    );

    if (!data.ok) {
      throw new Error("Nemozemo obrisati kategoriju servisa!");
    }

    const deleted_service = data.json();

    if (deleted_service.result === false) {
      throw new Error("Nemozemo obrisati kategoriju servisa!");
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error };
  }
};

export const updateServiceCategory = async (new_service_category) => {
  try {
    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service_category",
      {
        method: "PATCH",
        body: JSON.stringify(new_service_category),
      }
    );

    if (!data.ok) {
      throw new Error("Nemožemo ažurirati kategoriju servisa");
    }

    const updated_service_category = await data.json();

    if (updated_service_category.result === false) {
      throw new Error(updated_service_category.err_log);
    }

    return {
      success: true,
      data: updated_service_category,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error,
    };
  }
};

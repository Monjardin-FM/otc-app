import { useEffect } from "react";
import * as Yup from "yup";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import {
  AppFormField,
  AppFormHelperText,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import { AppButton } from "../../../../../presentation/Components/AppButton";
import { useUser } from "../../hooks/use-user";
import * as Icon from "react-feather";
import { useFormik } from "formik";
export const AppUserAuthForm = () => {
  const { signIn, loading, error } = useUser();

  useEffect(() => {
    if (error) {
      AppToast().fire({ icon: "info", title: "Failed authentication" });
    }
  }, [error]);

  const formik = useFormik({
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email")
        .required("An email is required"),
      password: Yup.string().trim().required("Required Password"),
    }),
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ email, password }) => {
      console.log("login");
      signIn.execute({ email, password });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full">
      <AppFormField className="mt-7" isRequired>
        <AppFormLabel textColor="black" htmlFor="email">
          Email
        </AppFormLabel>
        <AppTextField
          colorSchema={
            formik.touched.email && formik.errors.email ? "red" : "gray"
          }
          id="email"
          name="email"
          type="email"
          leftIcon={<Icon.Mail size={20} />}
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <AppFormHelperText colorSchema="red">
            {formik.errors.email}
          </AppFormHelperText>
        )}
      </AppFormField>

      <AppFormField className="mt-5" isRequired>
        <AppFormLabel textColor="black" htmlFor="password">
          Password
        </AppFormLabel>
        <AppTextField
          colorSchema={
            formik.touched.password && formik.errors.password ? "red" : "gray"
          }
          id="password"
          name="password"
          type="password"
          leftIcon={<Icon.Lock size={20} />}
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <AppFormHelperText colorSchema="red">
            {formik.errors.password}
          </AppFormHelperText>
        )}
      </AppFormField>
      <div className="w-full flex items-center justify-center">
        <AppButton
          isLoading={loading === "pending"}
          type="submit"
          colorScheme="primary"
          className="w-1/2 mt-10"
          size="base"
        >
          Sign In
        </AppButton>
      </div>
    </form>
  );
};

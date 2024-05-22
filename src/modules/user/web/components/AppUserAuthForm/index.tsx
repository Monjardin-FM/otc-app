import { useEffect, useState } from "react";
import * as Yup from "yup";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import {
  AppFormField,
  AppFormHelperText,
} from "../../../../../presentation/Components/AppForm";
import { AppButton } from "../../../../../presentation/Components/AppButton";
import { useUser } from "../../hooks/use-user";
import * as Icon from "react-feather";
import { useFormik } from "formik";
import { Input } from "@nextui-org/react";
export const AppUserAuthForm = () => {
  const { signIn, loading, error } = useUser();
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);
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
      signIn.execute({ email, password });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full " autoComplete="off">
      <AppFormField className="mt-7" isRequired>
        <Input
          id="email"
          name="email"
          label="Email"
          labelPlacement="inside"
          value={formik.values.email}
          onChange={formik.handleChange}
          radius="sm"
          variant="faded"
          size="md"
          startContent={<Icon.Mail size={15} />}
          type="email"
        />
        {formik.touched.email && formik.errors.email && (
          <AppFormHelperText colorSchema="red">
            {formik.errors.email}
          </AppFormHelperText>
        )}
      </AppFormField>

      <AppFormField className="mt-10" isRequired>
        <Input
          id="password"
          name="password"
          label="Password"
          labelPlacement="inside"
          value={formik.values.password}
          onChange={formik.handleChange}
          radius="sm"
          variant="faded"
          size="md"
          startContent={<Icon.Lock size={15} />}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisiblePassword ? (
                <Icon.EyeOff size={15} />
              ) : (
                <Icon.Eye size={15} />
              )}
            </button>
          }
          type={isVisiblePassword ? "text" : "password"}
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

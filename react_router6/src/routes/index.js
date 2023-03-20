import About from "../page/About";
import Home from "../page/Home";
import { Navigate } from "react-router-dom";
import News from "../page/Home/News/News";
import Message from "../page/Home/Message/Message";
import Details from "../page/Home/Message/Details";
export const routes = [
  {
    path: "/home",
    element: <Home />,
    children: [
      { path: "news", element: <News /> },
      {
        path: "message",
        element: <Message />,
        children: [
          // { path: "details/:id/:title/:content", element: <Details /> },
          { path: "details", element: <Details /> },
        ],
      },
    ],
  },
  { path: "/about", element: <About /> },
  { path: "/", element: <Navigate to="/about" replace={true} /> },
];

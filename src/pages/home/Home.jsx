

import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import Stories from "../../components/stories.jsx/Stories"
import "./home.scss"

export default function Home() {
    return (
        <div className="home">
            <Stories />
            <Share />
            <Posts />
        </div>
    )
}

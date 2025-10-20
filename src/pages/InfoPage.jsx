import MainLayout from "../shared/layouts/MainLayout"
import InfoBanner from "../shared/components/InfoPage/InfoBanner"
import InfoBrand from "../shared/components/InfoPage/InfoBrand"
import InfoReason from "../shared/components/InfoPage/InfoReason"
import InfoContact from "../shared/components/InfoPage/InfoContact"

import "../shared/styles/InfoPage.css"

export default function InfoPage() {
    return (
        <MainLayout>
            <InfoBanner/>
            <div className="info-maincontent">
                <InfoBrand/>
                <InfoReason/>
                <InfoContact/>
            </div>
        </MainLayout>
    )
}
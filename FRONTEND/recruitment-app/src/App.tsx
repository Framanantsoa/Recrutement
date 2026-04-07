import { Routes, Route, Outlet } from 'react-router-dom';
import LoginPage from '@/features/auth/login';
import Template from '@/layouts/template';
import UserList from '@/pages/users';
import LogList from '@/pages/logs';
import RoleList from '@/pages/access';
import Error403Page from '@/pages/error/403';
import ProfilePage from '@/layouts/profil-page';
import MissionList from '@/pages/mission/collaborator/list/index';
import DetailsMission from '@/pages/mission/collaborator/details/mission-details';
import MissionValidationPage from '@/pages/mission/validation';
import TresoPage from '@/pages/mission/treso';
import ProtectedHabilitationList from '@/pages/access/habilitation';
import ImportPage from '@/pages/import';
import Referentiel from '@/pages/referentiel';
import DirectionList from '@/pages/referentiel/direction/list';
import DepartmentList from '@/pages/referentiel/department/list';
import ServiceList from '@/pages/referentiel/service/list';
import SiteList from '@/pages/referentiel/site/list';
import GenderList from '@/pages/referentiel/gender/list';
import ContractTypeList from './pages/referentiel/contract/list';
import UnitList from '@/pages/referentiel/unit/list';
import EmployeeList from '@/pages/referentiel/collaborateur/list';
import LieuList from '@/pages/referentiel/lieu/list';
import TransportList from '@/pages/referentiel/transport/list';
import CompensationScalesPage from '@/pages/referentiel/compensation-scale';
import CompensationMission from '@/pages/mission/treso/components/compensation_mission';
import Reimbursement from '@/pages/mission/treso/components/reimbursement';
import MissionsEnCoursMapPage from './pages/maps';
import Home from '@/pages/Home';
import { ValidateursPage } from '@/pages/mission/validators_flow';
import RequestList from './pages/recruitment/request/list';
import DraftRequestList from './pages/recruitment/request/validation/list';
import RequestDetails from './pages/recruitment/request/details';
import CandidatureList from './pages/recruitment/candidature/list';
import CandidatureDetailsPage from './pages/recruitment/candidature/details';
import DraftPlaningList from './pages/recruitment/job-interview/planing';
// import { useAuthSync } from '@/utils/use-auth-sync';
function App() {

  // useAuthSync();
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      
     

      
      <Route element={<Template><Outlet /></Template>}>
        {/* IMPORT */}
        <Route path="/donnees" element={<ImportPage />} />
        
        <Route path="/profil-page" element={<ProfilePage />} />
        {/* ADMIN */}
        <Route path="/dashboard" element={<Home />} />
        {/* <Route path="/tableau-bord" element={<TableauBord />} /> */}
        <Route path="/utilisateurs" element={<UserList />} />
        <Route path="/logs" element={<LogList />} />
        <Route path="/roles" element={<RoleList />} />
        <Route path="/habilitations" element={<ProtectedHabilitationList />} />
        <Route path="/referentiels" element={<Referentiel />} />
        <Route path="/referentiels/direction" element={<DirectionList />} />
        <Route path="/referentiels/department" element={<DepartmentList />} />
        <Route path="/referentiels/service" element={<ServiceList />} />
        <Route path="/referentiels/site" element={<SiteList />} />
        <Route path="/referentiels/genders" element={<GenderList />} />
        <Route path="/referentiels/contract" element={<ContractTypeList />} />
        <Route path="/referentiels/unit" element={<UnitList />} />
        <Route path="/referentiels/collaborator" element={<EmployeeList />} />
        <Route path="/referentiels/lieu" element={<LieuList />} />
        <Route path="/referentiels/transport" element={<TransportList />} />
        <Route path="/referentiels/compensation-scale" element={<CompensationScalesPage />} />

        {/* MISSION */}
        <Route path="/mission/list" element={<MissionList />} />
        <Route path="/mission/maps" element={<MissionsEnCoursMapPage />} />
        <Route path="/mission/:missionId/*" element={<DetailsMission />} />
        <Route path="/mission/to-validate" element={<MissionValidationPage />} />
        {/* TRESO */}
        <Route path="/treasury" element={<TresoPage />} />
        <Route path="/treasury/compensation" element={<CompensationMission />} />
        <Route path="/treasury/remboursement" element={<Reimbursement />} />

        {/* RECRUTEMENT */}
        <Route path="/recrutement/validateurs" element={<ValidateursPage />} />
        <Route path="/recrutement/liste-demandes" element={<RequestList />} />
        <Route path="/recrutement/demandes/:id/details" element={<RequestDetails />} />
        <Route path="/recrutement/a-valider" element={<DraftRequestList />} />
        <Route path="/recrutement/candidatures/tdr/:jobId" element={<CandidatureList />} />
        <Route path="/recrutement/candidatures/:id/details" element={<CandidatureDetailsPage />} />
        <Route path="/recrutement/liste-entretiens" element={<DraftPlaningList />} />

        {/* ERROR */}
        <Route path="/403" element={<Error403Page />} />
      </Route>
    </Routes>
  );
}

export default App;
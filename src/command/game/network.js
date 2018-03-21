import R from 'ramda';

const getBroadcastNetworks = televisionNetworks => {
  const findNetwork = prop =>
    R.find(R.propEq('home_visitor', prop))(televisionNetworks);

  let homeTeamNetwork = findNetwork('home');
  let visitorTeamNetwork = findNetwork('visitor');
  let nationalNetwork = findNetwork('natl');

  nationalNetwork = !nationalNetwork ? 'N/A' : nationalNetwork.display_name;
  homeTeamNetwork = !homeTeamNetwork
    ? nationalNetwork
    : homeTeamNetwork.display_name;
  visitorTeamNetwork = !visitorTeamNetwork
    ? nationalNetwork
    : visitorTeamNetwork.display_name;

  return {
    homeTeam: homeTeamNetwork,
    visitorTeam: visitorTeamNetwork,
  };
};

export default getBroadcastNetworks;
